// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Hypeman from '@onkernel/hypeman';

const client = new Hypeman({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource instances', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.instances.create({
      image: 'docker.io/library/alpine:latest',
      name: 'my-workload-1',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('create: required and optional params', async () => {
    const response = await client.instances.create({
      image: 'docker.io/library/alpine:latest',
      name: 'my-workload-1',
      cmd: ['echo', 'hello'],
      credentials: {
        OUTBOUND_OPENAI_KEY: {
          inject: [
            {
              as: { format: 'Bearer ${value}', header: 'Authorization' },
              hosts: ['api.openai.com', '*.openai.com'],
            },
          ],
          source: { env: 'OUTBOUND_OPENAI_KEY' },
        },
      },
      devices: ['l4-gpu'],
      disk_io_bps: '100MB/s',
      entrypoint: ['/bin/sh', '-c'],
      env: { PORT: '3000', NODE_ENV: 'production' },
      gpu: { profile: 'L40S-1Q' },
      hotplug_size: '2GB',
      hypervisor: 'cloud-hypervisor',
      network: {
        bandwidth_download: '1Gbps',
        bandwidth_upload: '1Gbps',
        egress: {
          enabled: true,
          enforcement: { mode: 'all' },
        },
        enabled: true,
      },
      overlay_size: '20GB',
      size: '2GB',
      skip_guest_agent: false,
      skip_kernel_headers: true,
      tags: { team: 'backend', env: 'staging' },
      vcpus: 2,
      volumes: [
        {
          mount_path: '/mnt/data',
          volume_id: 'vol-abc123',
          overlay: true,
          overlay_size: '1GB',
          readonly: true,
        },
      ],
    });
  });

  // Mock server tests are disabled
  test.skip('update', async () => {
    const responsePromise = client.instances.update('id', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.instances.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.instances.list(
        {
          state: 'Created',
          tags: { team: 'backend', env: 'staging' },
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Hypeman.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('delete', async () => {
    const responsePromise = client.instances.delete('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('fork: only required params', async () => {
    const responsePromise = client.instances.fork('id', { name: 'my-workload-1-fork' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('fork: required and optional params', async () => {
    const response = await client.instances.fork('id', {
      name: 'my-workload-1-fork',
      from_running: false,
      target_state: 'Running',
    });
  });

  // Mock server tests are disabled
  test.skip('get', async () => {
    const responsePromise = client.instances.get('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('logs', async () => {
    const responsePromise = client.instances.logs('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('logs: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.instances.logs(
        'id',
        {
          follow: true,
          source: 'app',
          tail: 0,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Hypeman.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('restore', async () => {
    const responsePromise = client.instances.restore('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('standby', async () => {
    const responsePromise = client.instances.standby('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('start', async () => {
    const responsePromise = client.instances.start('id', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('stat: only required params', async () => {
    const responsePromise = client.instances.stat('id', { path: 'path' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('stat: required and optional params', async () => {
    const response = await client.instances.stat('id', { path: 'path', follow_links: true });
  });

  // Mock server tests are disabled
  test.skip('stats', async () => {
    const responsePromise = client.instances.stats('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('stop', async () => {
    const responsePromise = client.instances.stop('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
