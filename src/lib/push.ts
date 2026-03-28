/**
 * Push operations for uploading container images to the hypeman OCI registry.
 *
 * This module provides functions for pushing container images to hypeman's
 * built-in OCI registry, analogous to the Go SDK's lib/push.go.
 */

import * as crypto from 'crypto';
import * as http from 'http';
import * as https from 'https';
import * as zlib from 'zlib';
import Docker from 'dockerode';
import * as tar from 'tar-stream';

/**
 * Configuration needed to push images to hypeman's registry.
 * Extract this from a Hypeman client using {@link extractPushConfig}.
 */
export interface PushConfig {
  /** Host:port of the hypeman registry (derived from base URL) */
  registryHost: string;
  /** JWT token for authentication */
  apiKey: string;
}

/**
 * Represents a container image that can be pushed to a registry.
 *
 * Implement this interface to push images from any source. Use
 * {@link loadDockerImage} to create one from the local Docker daemon.
 */
export interface OciImageSource {
  /** Get the raw image config JSON */
  config(): Promise<Buffer>;
  /** Get all image layers as compressed (gzipped) tar buffers */
  layers(): Promise<OciLayer[]>;
}

/**
 * A single compressed image layer with its digest and size.
 */
export interface OciLayer {
  /** sha256 digest of the compressed layer (e.g., "sha256:abc123...") */
  digest: string;
  /** Size of the compressed layer in bytes */
  size: number;
  /** Compressed (gzipped) layer data */
  data: Buffer;
}

/**
 * Extract the registry host and API key from a Hypeman client.
 *
 * This is needed because the Client struct doesn't expose these values
 * through a dedicated push configuration. Accepts any object with
 * `baseURL` and `apiKey` properties (the Hypeman client satisfies this).
 *
 * @example
 * ```typescript
 * import Hypeman from '@onkernel/hypeman';
 * import { extractPushConfig, push } from '@onkernel/hypeman/lib/push';
 *
 * const client = new Hypeman({ apiKey: '...' });
 * const cfg = extractPushConfig(client);
 * await push(cfg, 'myapp:latest');
 * ```
 */
export function extractPushConfig(client: { apiKey: string; baseURL: string }): PushConfig {
  let host: string;
  try {
    host = new URL(client.baseURL).host;
  } catch {
    throw new Error(`Invalid base URL: ${client.baseURL}`);
  }
  if (!host) {
    throw new Error('Base URL not configured');
  }
  return {
    registryHost: host,
    apiKey: client.apiKey,
  };
}

/**
 * Push an {@link OciImageSource} to hypeman's OCI registry.
 *
 * This function works with images from any source that implements the
 * OciImageSource interface:
 * - Images loaded from the Docker daemon via {@link loadDockerImage}
 * - Custom image sources (tarballs, OCI layouts, build tools, etc.)
 *
 * The targetName parameter specifies how the image will be named in hypeman
 * (e.g., "myapp:latest" or "myorg/myapp:v1.0").
 *
 * @example
 * ```typescript
 * import { extractPushConfig, pushImage, loadDockerImage } from '@onkernel/hypeman/lib/push';
 *
 * const cfg = extractPushConfig(client);
 * const image = await loadDockerImage('myapp:latest');
 * await pushImage(cfg, image, 'myapp:latest');
 * ```
 */
export async function pushImage(cfg: PushConfig, image: OciImageSource, targetName: string): Promise<void> {
  if (!cfg.registryHost) {
    throw new Error('Registry host not configured');
  }

  const { repository, tag } = parseImageReference(targetName);
  const [configBuf, imageLayers] = await Promise.all([image.config(), image.layers()]);

  // Push layer blobs
  for (const layer of imageLayers) {
    await pushBlob(cfg, repository, layer.digest, layer.data);
  }

  // Push config blob
  const configDigest = `sha256:${sha256(configBuf)}`;
  await pushBlob(cfg, repository, configDigest, configBuf);

  // Construct and push the distribution manifest
  const manifest = JSON.stringify({
    schemaVersion: 2,
    mediaType: 'application/vnd.docker.distribution.manifest.v2+json',
    config: {
      mediaType: 'application/vnd.docker.container.image.v1+json',
      digest: configDigest,
      size: configBuf.length,
    },
    layers: imageLayers.map((l) => ({
      mediaType: 'application/vnd.docker.image.rootfs.diff.tar.gzip',
      digest: l.digest,
      size: l.size,
    })),
  });

  const manifestBuf = Buffer.from(manifest);
  const res = await registryRequest(
    cfg,
    'PUT',
    `/v2/${repository}/manifests/${tag}`,
    manifestBuf,
    'application/vnd.docker.distribution.manifest.v2+json',
  );

  if (res.statusCode !== 201 && res.statusCode !== 200) {
    throw new Error(`Push failed: HTTP ${res.statusCode}: ${res.body.toString()}`);
  }
}

/**
 * Load an image from the local Docker daemon and push it to hypeman's registry.
 *
 * This is a convenience function for local development workflows where images
 * are built using Docker. For CI/CD pipelines or other image sources,
 * use {@link pushImage} directly with a custom {@link OciImageSource}.
 *
 * @param cfg - Push configuration (from {@link extractPushConfig})
 * @param sourceImage - Local Docker image reference (e.g., "myapp:latest")
 * @param targetName - Name in hypeman (defaults to sourceImage if empty)
 *
 * @example
 * ```typescript
 * import { extractPushConfig, push } from '@onkernel/hypeman/lib/push';
 *
 * const cfg = extractPushConfig(client);
 * await push(cfg, 'myapp:latest');
 * ```
 */
export async function push(cfg: PushConfig, sourceImage: string, targetName?: string): Promise<void> {
  const image = await loadDockerImage(sourceImage);
  return pushImage(cfg, image, targetName || sourceImage);
}

/**
 * Convenience function that parses a base URL and API key directly,
 * without needing a Hypeman client. Useful for standalone scripts.
 *
 * @param baseURL - The hypeman API base URL
 * @param apiKey - API key for authentication
 * @param image - The image to push
 * @param targetName - How to name the image in hypeman
 */
export async function pushFromURL(
  baseURL: string,
  apiKey: string,
  image: OciImageSource,
  targetName: string,
): Promise<void> {
  const url = new URL(baseURL);
  return pushImage({ registryHost: url.host, apiKey }, image, targetName);
}

/**
 * Load an image from the local Docker daemon.
 *
 * Uses dockerode to export the image (equivalent to `docker save`),
 * then parses the tar archive with tar-stream to extract the config
 * and layers. Requires Docker to be installed and running locally.
 *
 * @param imageRef - Docker image reference (e.g., "myapp:latest")
 * @returns An {@link OciImageSource} that can be passed to {@link pushImage}
 */
export async function loadDockerImage(imageRef: string): Promise<OciImageSource> {
  const docker = new Docker();

  let stream: NodeJS.ReadableStream;
  try {
    stream = await docker.getImage(imageRef).get();
  } catch (err: any) {
    throw new Error(`Load image from Docker daemon: ${err.message}`);
  }

  const files = await extractTarEntries(stream);
  return parseDockerSaveArchive(files);
}

// --- Docker save archive parsing ---

interface DockerSaveManifestEntry {
  Config: string;
  RepoTags: string[];
  Layers: string[];
}

async function parseDockerSaveArchive(files: Map<string, Buffer>): Promise<OciImageSource> {
  const manifestBuf = files.get('manifest.json');
  if (!manifestBuf) {
    throw new Error('No manifest.json found in docker save output');
  }

  const manifest = JSON.parse(manifestBuf.toString()) as DockerSaveManifestEntry[];
  if (manifest.length === 0) {
    throw new Error('Empty manifest in docker save output');
  }

  const entry = manifest[0]!;

  const configBuf = files.get(entry.Config);
  if (!configBuf) {
    throw new Error(`Config file ${entry.Config} not found in archive`);
  }

  // docker save outputs uncompressed layer tars — gzip them for the registry
  const layers: OciLayer[] = [];
  for (const layerPath of entry.Layers) {
    const layerBuf = files.get(layerPath);
    if (!layerBuf) {
      throw new Error(`Layer ${layerPath} not found in archive`);
    }
    const compressed = await gzipBuffer(layerBuf);
    layers.push({
      digest: `sha256:${sha256(compressed)}`,
      size: compressed.length,
      data: compressed,
    });
  }

  return {
    config: async () => configBuf,
    layers: async () => layers,
  };
}

// --- Tar extraction via tar-stream ---

async function extractTarEntries(stream: NodeJS.ReadableStream): Promise<Map<string, Buffer>> {
  const extract = tar.extract();
  const files = new Map<string, Buffer>();

  return new Promise((resolve, reject) => {
    extract.on('entry', (header, entryStream, next) => {
      if (header.type === 'file') {
        const chunks: Buffer[] = [];
        entryStream.on('data', (chunk: Buffer) => chunks.push(chunk));
        entryStream.on('end', () => {
          files.set(header.name, Buffer.concat(chunks));
          next();
        });
        entryStream.on('error', reject);
      } else {
        entryStream.resume();
        next();
      }
    });

    extract.on('finish', () => resolve(files));
    extract.on('error', reject);

    stream.pipe(extract);
  });
}

// --- OCI Distribution push client ---

interface RegistryResponse {
  statusCode: number;
  headers: http.IncomingHttpHeaders;
  body: Buffer;
}

function registryRequest(
  cfg: PushConfig,
  method: string,
  reqPath: string,
  body?: Buffer,
  contentType?: string,
): Promise<RegistryResponse> {
  return new Promise((resolve, reject) => {
    const [hostname, portStr] = cfg.registryHost.split(':');
    const secure = !isInsecureHost(hostname!);
    const mod = secure ? https : http;
    const defaultPort = secure ? 443 : 80;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${cfg.apiKey}`,
    };
    if (contentType) headers['Content-Type'] = contentType;
    if (body) headers['Content-Length'] = String(body.length);

    const req = mod.request(
      {
        hostname,
        port: portStr ? parseInt(portStr) : defaultPort,
        method,
        path: reqPath,
        headers,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c: Buffer) => chunks.push(c));
        res.on('end', () =>
          resolve({ statusCode: res.statusCode || 0, headers: res.headers, body: Buffer.concat(chunks) }),
        );
      },
    );
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function pushBlob(cfg: PushConfig, repository: string, digest: string, data: Buffer): Promise<void> {
  // Check if blob already exists
  const head = await registryRequest(cfg, 'HEAD', `/v2/${repository}/blobs/${digest}`);
  if (head.statusCode === 200) return;

  // Start monolithic upload
  const start = await registryRequest(cfg, 'POST', `/v2/${repository}/blobs/uploads/`);
  if (start.statusCode !== 202) {
    throw new Error(`Start blob upload failed (HTTP ${start.statusCode}): ${start.body.toString()}`);
  }

  let location = start.headers.location;
  if (!location) {
    throw new Error('No Location header in upload response');
  }

  // Location may be an absolute URL or relative path
  if (!location.startsWith('/')) {
    const url = new URL(location);
    location = url.pathname + url.search;
  }

  const sep = location.includes('?') ? '&' : '?';
  const uploadPath = `${location}${sep}digest=${encodeURIComponent(digest)}`;

  const upload = await registryRequest(cfg, 'PUT', uploadPath, data, 'application/octet-stream');
  if (upload.statusCode !== 201 && upload.statusCode !== 200) {
    throw new Error(`Upload blob failed (HTTP ${upload.statusCode}): ${upload.body.toString()}`);
  }
}

// --- Helpers ---

function parseImageReference(name: string): { repository: string; tag: string } {
  const cleaned = name.replace(/^\//, '');
  const lastColon = cleaned.lastIndexOf(':');
  if (lastColon > 0 && !cleaned.substring(lastColon).includes('/')) {
    return { repository: cleaned.substring(0, lastColon), tag: cleaned.substring(lastColon + 1) };
  }
  return { repository: cleaned, tag: 'latest' };
}

function sha256(data: Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function isInsecureHost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function gzipBuffer(data: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    zlib.gzip(data, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

