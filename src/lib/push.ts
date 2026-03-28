/**
 * Push operations for uploading container images to the hypeman OCI registry.
 *
 * This module provides functions for pushing container images to hypeman's
 * built-in OCI registry.
 */

import * as crypto from 'crypto';
import * as http from 'http';
import * as https from 'https';
import * as zlib from 'zlib';

/**
 * Configuration for push operations.
 */
export interface PushConfig {
  /** Base URL for the hypeman API */
  baseURL: string;
  /** API key (JWT token) for authentication */
  apiKey: string;
}

/**
 * Represents a container image that can be pushed to a registry.
 *
 * Implement this interface to push images from any source. Use
 * `loadDockerImage()` to create one from the local Docker daemon.
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
 * Push an OciImageSource to hypeman's OCI registry.
 *
 * This function works with images from any source that implements the
 * OciImageSource interface:
 * - Images loaded from the Docker daemon via `loadDockerImage()`
 * - Custom image sources
 *
 * The targetName parameter specifies how the image will be named in hypeman
 * (e.g., "myapp:latest" or "myorg/myapp:v1.0").
 *
 * @example
 * ```typescript
 * import { pushImage, loadDockerImage } from '@onkernel/hypeman/lib/push';
 *
 * const image = await loadDockerImage('myapp:latest');
 * await pushImage({
 *   baseURL: 'https://api.hypeman.dev',
 *   apiKey: 'your-api-key',
 * }, image, 'myapp:latest');
 * ```
 */
export async function pushImage(cfg: PushConfig, image: OciImageSource, targetName: string): Promise<void> {
  const registryURL = parseRegistryURL(cfg.baseURL);
  const { repository, tag } = parseImageReference(targetName);

  const [configBuf, imageLayers] = await Promise.all([image.config(), image.layers()]);

  // Push layer blobs
  for (const layer of imageLayers) {
    await pushBlob(registryURL, cfg.apiKey, repository, layer.digest, layer.data);
  }

  // Push config blob
  const configDigest = `sha256:${sha256(configBuf)}`;
  await pushBlob(registryURL, cfg.apiKey, repository, configDigest, configBuf);

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
    registryURL,
    cfg.apiKey,
    'PUT',
    `/v2/${repository}/manifests/${tag}`,
    manifestBuf,
    'application/vnd.docker.distribution.manifest.v2+json',
  );

  if (res.statusCode !== 201 && res.statusCode !== 200) {
    throw new Error(`Push manifest failed (HTTP ${res.statusCode}): ${res.body.toString()}`);
  }
}

/**
 * Load an image from the local Docker daemon and push it to hypeman's registry.
 *
 * This is a convenience function for local development workflows where images
 * are built using Docker. For images from other sources, use pushImage()
 * directly with a custom OciImageSource.
 *
 * @param cfg - Push configuration
 * @param sourceImage - Local Docker image reference (e.g., "myapp:latest")
 * @param targetName - Name in hypeman (defaults to sourceImage if omitted)
 *
 * @example
 * ```typescript
 * import { push } from '@onkernel/hypeman/lib/push';
 *
 * await push({
 *   baseURL: 'https://api.hypeman.dev',
 *   apiKey: 'your-api-key',
 * }, 'myapp:latest');
 * ```
 */
export async function push(cfg: PushConfig, sourceImage: string, targetName?: string): Promise<void> {
  const image = await loadDockerImage(sourceImage);
  return pushImage(cfg, image, targetName || sourceImage);
}

/**
 * Convenience function that parses a base URL and API key directly,
 * without needing a PushConfig object. Useful for standalone scripts.
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
  return pushImage({ baseURL, apiKey }, image, targetName);
}

/**
 * Load an image from the local Docker daemon.
 *
 * Uses the Docker CLI to export the image, then parses the tar archive
 * to extract the config and layers. Requires Docker to be installed and
 * running locally.
 *
 * @param imageRef - Docker image reference (e.g., "myapp:latest")
 * @returns An OciImageSource that can be passed to pushImage()
 */
export async function loadDockerImage(imageRef: string): Promise<OciImageSource> {
  const tarBuf = await dockerSave(imageRef);
  const files = parseTar(tarBuf);

  const manifestJsonBuf = files.get('manifest.json');
  if (!manifestJsonBuf) {
    throw new Error('No manifest.json found in docker save output');
  }

  const dockerManifest = JSON.parse(manifestJsonBuf.toString()) as Array<{
    Config: string;
    RepoTags: string[];
    Layers: string[];
  }>;

  if (dockerManifest.length === 0) {
    throw new Error('Empty manifest in docker save output');
  }

  const entry = dockerManifest[0]!;

  const configBuf = files.get(entry.Config);
  if (!configBuf) {
    throw new Error(`Config file ${entry.Config} not found in archive`);
  }

  // Compress layers (docker save outputs uncompressed tars)
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

// --- Internal helpers ---

interface RegistryURL {
  protocol: 'http:' | 'https:';
  hostname: string;
  port: number;
}

function parseRegistryURL(baseURL: string): RegistryURL {
  const url = new URL(baseURL);
  const isHTTPS = url.protocol === 'https:';
  return {
    protocol: url.protocol as 'http:' | 'https:',
    hostname: url.hostname,
    port: url.port ? parseInt(url.port) : isHTTPS ? 443 : 80,
  };
}

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

interface RegistryResponse {
  statusCode: number;
  headers: http.IncomingHttpHeaders;
  body: Buffer;
}

function registryRequest(
  reg: RegistryURL,
  apiKey: string,
  method: string,
  reqPath: string,
  body?: Buffer,
  contentType?: string,
): Promise<RegistryResponse> {
  return new Promise((resolve, reject) => {
    const mod = reg.protocol === 'https:' ? https : http;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${apiKey}`,
    };
    if (contentType) headers['Content-Type'] = contentType;
    if (body) headers['Content-Length'] = String(body.length);

    const req = mod.request(
      { hostname: reg.hostname, port: reg.port, method, path: reqPath, headers },
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

async function pushBlob(
  reg: RegistryURL,
  apiKey: string,
  repository: string,
  digest: string,
  data: Buffer,
): Promise<void> {
  // Check if blob already exists
  const head = await registryRequest(reg, apiKey, 'HEAD', `/v2/${repository}/blobs/${digest}`);
  if (head.statusCode === 200) return;

  // Start monolithic upload
  const start = await registryRequest(reg, apiKey, 'POST', `/v2/${repository}/blobs/uploads/`);
  if (start.statusCode !== 202) {
    throw new Error(`Start blob upload failed (HTTP ${start.statusCode}): ${start.body.toString()}`);
  }

  let location = start.headers.location;
  if (!location) throw new Error('No Location header in upload response');

  // Location may be an absolute URL or relative path
  if (!location.startsWith('/')) {
    const url = new URL(location);
    location = url.pathname + url.search;
  }

  const sep = location.includes('?') ? '&' : '?';
  const uploadPath = `${location}${sep}digest=${encodeURIComponent(digest)}`;

  const upload = await registryRequest(reg, apiKey, 'PUT', uploadPath, data, 'application/octet-stream');
  if (upload.statusCode !== 201 && upload.statusCode !== 200) {
    throw new Error(`Upload blob failed (HTTP ${upload.statusCode}): ${upload.body.toString()}`);
  }
}

function dockerSave(imageRef: string): Promise<Buffer> {
  const { spawn } = require('child_process') as typeof import('child_process');

  return new Promise((resolve, reject) => {
    const proc = spawn('docker', ['save', imageRef]);
    const chunks: Buffer[] = [];

    proc.stdout.on('data', (chunk: Buffer) => chunks.push(chunk));
    proc.on('error', (err: Error) => reject(new Error(`Failed to run docker: ${err.message}`)));
    proc.on('close', (code: number) => {
      if (code !== 0) reject(new Error(`docker save exited with code ${code}`));
      else resolve(Buffer.concat(chunks));
    });
  });
}

/**
 * Minimal tar parser for docker save output.
 * Extracts regular files into a filename -> Buffer map.
 */
function parseTar(tar: Buffer): Map<string, Buffer> {
  const files = new Map<string, Buffer>();
  let offset = 0;

  while (offset + 512 <= tar.length) {
    const header = tar.subarray(offset, offset + 512);
    if (header.every((b) => b === 0)) break;

    let name = header.subarray(0, 100).toString('ascii').replace(/\0/g, '');
    const prefix = header.subarray(345, 500).toString('ascii').replace(/\0/g, '');
    if (prefix) name = prefix + '/' + name;

    const sizeStr = header.subarray(124, 136).toString('ascii').replace(/\0/g, '').trim();
    const size = parseInt(sizeStr, 8) || 0;
    const typeFlag = header[156];

    offset += 512;

    if (typeFlag === 0x30 || typeFlag === 0x00) {
      files.set(name, size > 0 ? Buffer.from(tar.subarray(offset, offset + size)) : Buffer.alloc(0));
    }

    offset += Math.ceil(size / 512) * 512;
  }

  return files;
}

function gzipBuffer(data: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    zlib.gzip(data, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}
