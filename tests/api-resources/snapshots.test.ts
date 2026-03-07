// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Hypeman from '@onkernel/hypeman';

const client = new Hypeman({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource snapshots', () => {
  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.snapshots.list();
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
      client.snapshots.list(
        {
          kind: 'Standby',
          metadata: { team: 'backend', env: 'staging' },
          name: 'name',
          source_instance_id: 'source_instance_id',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Hypeman.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('delete', async () => {
    const responsePromise = client.snapshots.delete('snapshotId');
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
    const responsePromise = client.snapshots.fork('snapshotId', { name: 'nginx-from-snap' });
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
    const response = await client.snapshots.fork('snapshotId', {
      name: 'nginx-from-snap',
      target_hypervisor: 'cloud-hypervisor',
      target_state: 'Running',
    });
  });

  // Mock server tests are disabled
  test.skip('get', async () => {
    const responsePromise = client.snapshots.get('snapshotId');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
