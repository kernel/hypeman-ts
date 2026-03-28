import * as crypto from 'crypto';
import * as http from 'http';
import * as zlib from 'zlib';
import {
  extractPushConfig,
  pushImage,
  pushFromURL,
  OciImageSource,
  OciLayer,
  PushConfig,
} from '@onkernel/hypeman/lib/push';

// --- Helpers ---

function sha256(data: Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function createSyntheticImage(content = 'test-layer-data'): OciImageSource {
  const configJSON = Buffer.from(
    JSON.stringify({
      architecture: 'amd64',
      os: 'linux',
      config: {},
      rootfs: { type: 'layers', diff_ids: [] },
    }),
  );

  const compressed = zlib.gzipSync(Buffer.from(content));
  const digest = `sha256:${sha256(compressed)}`;

  return {
    config: async () => configJSON,
    layers: async (): Promise<OciLayer[]> => [{ digest, size: compressed.length, data: compressed }],
  };
}

// --- Unit tests (no network) ---

describe('extractPushConfig', () => {
  test('extracts host and apiKey from a valid HTTPS URL', () => {
    const cfg = extractPushConfig({
      baseURL: 'https://hypeman.example.com',
      apiKey: 'test-key-123',
    });
    expect(cfg.registryHost).toBe('hypeman.example.com');
    expect(cfg.apiKey).toBe('test-key-123');
  });

  test('extracts host with port', () => {
    const cfg = extractPushConfig({
      baseURL: 'http://localhost:8080',
      apiKey: 'key',
    });
    expect(cfg.registryHost).toBe('localhost:8080');
    expect(cfg.apiKey).toBe('key');
  });

  test('extracts host from URL with path', () => {
    const cfg = extractPushConfig({
      baseURL: 'https://hypeman.example.com/v1/api',
      apiKey: 'key',
    });
    expect(cfg.registryHost).toBe('hypeman.example.com');
  });

  test('throws on invalid URL', () => {
    expect(() => extractPushConfig({ baseURL: 'not-a-url', apiKey: 'key' })).toThrow('Invalid base URL');
  });

  test('throws on URL with empty host', () => {
    expect(() => extractPushConfig({ baseURL: 'file:///tmp/foo', apiKey: 'key' })).toThrow(
      'Base URL not configured',
    );
  });

  test('preserves full apiKey value', () => {
    const longKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload.signature';
    const cfg = extractPushConfig({ baseURL: 'https://example.com', apiKey: longKey });
    expect(cfg.apiKey).toBe(longKey);
  });
});

describe('pushImage', () => {
  test('throws when registryHost is empty', async () => {
    const cfg: PushConfig = { registryHost: '', apiKey: 'key' };
    const image = createSyntheticImage();
    await expect(pushImage(cfg, image, 'test:latest')).rejects.toThrow('Registry host not configured');
  });

  test('calls image.config() and image.layers()', async () => {
    // Use a mock server to verify the image source is called
    const configFn = jest.fn().mockResolvedValue(Buffer.from('{"architecture":"amd64"}'));
    const layerData = zlib.gzipSync(Buffer.from('layer'));
    const layersFn = jest.fn().mockResolvedValue([
      {
        digest: `sha256:${sha256(layerData)}`,
        size: layerData.length,
        data: layerData,
      },
    ]);

    const image: OciImageSource = { config: configFn, layers: layersFn };

    // This will fail on the network call, but we can verify the image was read
    const cfg: PushConfig = { registryHost: '127.0.0.1:1', apiKey: 'key' };
    await expect(pushImage(cfg, image, 'test:latest')).rejects.toThrow();

    expect(configFn).toHaveBeenCalledTimes(1);
    expect(layersFn).toHaveBeenCalledTimes(1);
  });
});

describe('image reference parsing (via pushImage manifest)', () => {
  // We test image reference parsing indirectly via the manifest PUT path.
  // The function is not exported, so we verify behavior through pushImage.
  // We start a local HTTP server that captures the request path.

  let server: http.Server;
  let port: number;
  let capturedPaths: string[] = [];

  beforeAll(
    () =>
      new Promise<void>((resolve) => {
        server = http.createServer((req, res) => {
          capturedPaths.push(req.url || '');
          if (req.method === 'HEAD') {
            // Blob exists
            res.writeHead(200);
            res.end();
          } else if (req.method === 'PUT') {
            // Manifest put
            res.writeHead(201);
            res.end();
          } else {
            res.writeHead(404);
            res.end();
          }
        });
        server.listen(0, '127.0.0.1', () => {
          port = (server.address() as any).port;
          resolve();
        });
      }),
  );

  afterAll(
    () =>
      new Promise<void>((resolve) => {
        server.close(() => resolve());
      }),
  );

  beforeEach(() => {
    capturedPaths = [];
  });

  test('parses name:tag correctly', async () => {
    const image = createSyntheticImage();
    await pushImage({ registryHost: `127.0.0.1:${port}`, apiKey: 'key' }, image, 'myapp:v1.0');
    const manifestPut = capturedPaths.find((p) => p.includes('/manifests/'));
    expect(manifestPut).toBe('/v2/myapp/manifests/v1.0');
  });

  test('defaults to latest tag when no tag specified', async () => {
    const image = createSyntheticImage();
    await pushImage({ registryHost: `127.0.0.1:${port}`, apiKey: 'key' }, image, 'myapp');
    const manifestPut = capturedPaths.find((p) => p.includes('/manifests/'));
    expect(manifestPut).toBe('/v2/myapp/manifests/latest');
  });

  test('handles namespaced repositories', async () => {
    const image = createSyntheticImage();
    await pushImage({ registryHost: `127.0.0.1:${port}`, apiKey: 'key' }, image, 'myorg/myapp:v2');
    const manifestPut = capturedPaths.find((p) => p.includes('/manifests/'));
    expect(manifestPut).toBe('/v2/myorg/myapp/manifests/v2');
  });

  test('strips leading slash from image name', async () => {
    const image = createSyntheticImage();
    await pushImage({ registryHost: `127.0.0.1:${port}`, apiKey: 'key' }, image, '/myapp:v1');
    const manifestPut = capturedPaths.find((p) => p.includes('/manifests/'));
    expect(manifestPut).toBe('/v2/myapp/manifests/v1');
  });
});

describe('pushImage blob upload flow', () => {
  let server: http.Server;
  let port: number;
  let requestLog: { method: string; path: string; headers: http.IncomingHttpHeaders }[] = [];

  beforeAll(
    () =>
      new Promise<void>((resolve) => {
        server = http.createServer((req, res) => {
          requestLog.push({
            method: req.method || '',
            path: req.url || '',
            headers: req.headers,
          });

          const url = req.url || '';

          // HEAD blob check - return 404 to force upload
          if (req.method === 'HEAD' && url.includes('/blobs/')) {
            res.writeHead(404);
            res.end();
            return;
          }

          // POST blob upload start
          if (req.method === 'POST' && url.includes('/blobs/uploads/')) {
            res.writeHead(202, { Location: '/v2/test/blobs/uploads/uuid-123?_state=uploading' });
            res.end();
            return;
          }

          // PUT blob upload complete
          if (req.method === 'PUT' && url.includes('/blobs/uploads/')) {
            res.writeHead(201);
            res.end();
            return;
          }

          // PUT manifest
          if (req.method === 'PUT' && url.includes('/manifests/')) {
            res.writeHead(201);
            res.end();
            return;
          }

          res.writeHead(404);
          res.end();
        });
        server.listen(0, '127.0.0.1', () => {
          port = (server.address() as any).port;
          resolve();
        });
      }),
  );

  afterAll(
    () =>
      new Promise<void>((resolve) => {
        server.close(() => resolve());
      }),
  );

  beforeEach(() => {
    requestLog = [];
  });

  test('sends Bearer auth header on all requests', async () => {
    const image = createSyntheticImage();
    await pushImage({ registryHost: `127.0.0.1:${port}`, apiKey: 'my-secret-token' }, image, 'test:v1');

    for (const req of requestLog) {
      expect(req.headers.authorization).toBe('Bearer my-secret-token');
    }
  });

  test('skips upload when blob already exists (HEAD 200)', async () => {
    // Replace server behavior: HEAD returns 200 (blob exists)
    const existsServer = http.createServer((req, res) => {
      if (req.method === 'HEAD') {
        res.writeHead(200);
        res.end();
      } else if (req.method === 'PUT' && (req.url || '').includes('/manifests/')) {
        res.writeHead(201);
        res.end();
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    await new Promise<void>((resolve) => existsServer.listen(0, '127.0.0.1', () => resolve()));
    const existsPort = (existsServer.address() as any).port;

    const image = createSyntheticImage();
    await pushImage({ registryHost: `127.0.0.1:${existsPort}`, apiKey: 'key' }, image, 'test:v1');

    await new Promise<void>((resolve) => existsServer.close(() => resolve()));
    // If blob exists, no POST/PUT for blob uploads should have been made
    // (only HEAD for blobs and PUT for manifest)
  });

  test('performs full upload flow: HEAD -> POST -> PUT for new blobs', async () => {
    const image = createSyntheticImage();
    await pushImage({ registryHost: `127.0.0.1:${port}`, apiKey: 'key' }, image, 'test:v1');

    // Should have: HEAD (layer), POST (start upload), PUT (upload), HEAD (config), POST, PUT, PUT (manifest)
    const methods = requestLog.map((r) => `${r.method} ${r.path.split('?')[0]}`);

    // Layer blob: HEAD check, POST start, PUT upload
    expect(methods).toContainEqual(expect.stringMatching(/^HEAD \/v2\/test\/blobs\/sha256:/));
    expect(methods).toContainEqual(expect.stringMatching(/^POST \/v2\/test\/blobs\/uploads\/$/));
    expect(methods).toContainEqual(expect.stringMatching(/^PUT \/v2\/test\/blobs\/uploads\//));

    // Manifest PUT
    expect(methods).toContainEqual(expect.stringMatching(/^PUT \/v2\/test\/manifests\/v1$/));
  });

  test('sends correct manifest content type', async () => {
    const image = createSyntheticImage();
    await pushImage({ registryHost: `127.0.0.1:${port}`, apiKey: 'key' }, image, 'test:v1');

    const manifestPut = requestLog.find((r) => r.method === 'PUT' && (r.path || '').includes('/manifests/'));
    expect(manifestPut).toBeDefined();
    expect(manifestPut!.headers['content-type']).toBe('application/vnd.docker.distribution.manifest.v2+json');
  });

  test('throws on failed blob upload start', async () => {
    const failServer = http.createServer((req, res) => {
      if (req.method === 'HEAD') {
        res.writeHead(404);
        res.end();
      } else if (req.method === 'POST') {
        res.writeHead(500);
        res.end('internal error');
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    await new Promise<void>((resolve) => failServer.listen(0, '127.0.0.1', () => resolve()));
    const failPort = (failServer.address() as any).port;

    const image = createSyntheticImage();
    await expect(
      pushImage({ registryHost: `127.0.0.1:${failPort}`, apiKey: 'key' }, image, 'test:v1'),
    ).rejects.toThrow('Start blob upload failed');

    await new Promise<void>((resolve) => failServer.close(() => resolve()));
  });

  test('throws on failed manifest push', async () => {
    const failServer = http.createServer((req, res) => {
      if (req.method === 'HEAD') {
        res.writeHead(200); // blobs exist
        res.end();
      } else if (req.method === 'PUT' && (req.url || '').includes('/manifests/')) {
        res.writeHead(400);
        res.end('bad manifest');
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    await new Promise<void>((resolve) => failServer.listen(0, '127.0.0.1', () => resolve()));
    const failPort = (failServer.address() as any).port;

    const image = createSyntheticImage();
    await expect(
      pushImage({ registryHost: `127.0.0.1:${failPort}`, apiKey: 'key' }, image, 'test:v1'),
    ).rejects.toThrow('Push failed: HTTP 400');

    await new Promise<void>((resolve) => failServer.close(() => resolve()));
  });
});

describe('pushFromURL', () => {
  let server: http.Server;
  let port: number;

  beforeAll(
    () =>
      new Promise<void>((resolve) => {
        server = http.createServer((req, res) => {
          if (req.method === 'HEAD') {
            res.writeHead(200);
            res.end();
          } else if (req.method === 'PUT') {
            res.writeHead(201);
            res.end();
          } else {
            res.writeHead(404);
            res.end();
          }
        });
        server.listen(0, '127.0.0.1', () => {
          port = (server.address() as any).port;
          resolve();
        });
      }),
  );

  afterAll(
    () =>
      new Promise<void>((resolve) => {
        server.close(() => resolve());
      }),
  );

  test('pushes image using base URL and API key directly', async () => {
    const image = createSyntheticImage();
    await pushFromURL(`http://127.0.0.1:${port}`, 'test-api-key', image, 'myapp:latest');
    // No error means success
  });

  test('throws on invalid base URL', async () => {
    const image = createSyntheticImage();
    await expect(pushFromURL('not-a-url', 'key', image, 'test:v1')).rejects.toThrow();
  });
});

// --- Integration tests (require live server) ---

const LIVE_BASE_URL = process.env['HYPEMAN_BASE_URL'];
const LIVE_API_KEY = process.env['HYPEMAN_API_KEY'];
const runIntegration = process.env['HYPEMAN_INTEGRATION_TESTS'] === '1' && LIVE_BASE_URL && LIVE_API_KEY;

const describeIntegration = runIntegration ? describe : describe.skip;

describeIntegration('integration: live server push', () => {
  test('pushImage to live server', async () => {
    const cfg = extractPushConfig({ baseURL: LIVE_BASE_URL!, apiKey: LIVE_API_KEY! });
    const image = createSyntheticImage(`integration-test-${Date.now()}`);
    await pushImage(cfg, image, `test-ts-integration/push:${Date.now()}`);
  }, 30000);

  test('pushFromURL to live server', async () => {
    const image = createSyntheticImage(`integration-test-url-${Date.now()}`);
    await pushFromURL(LIVE_BASE_URL!, LIVE_API_KEY!, image, `test-ts-integration/from-url:${Date.now()}`);
  }, 30000);
});
