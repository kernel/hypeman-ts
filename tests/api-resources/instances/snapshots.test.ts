// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Hypeman from '@onkernel/hypeman';

const client = new Hypeman({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource snapshots', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.instances.snapshots.create('id', { kind: 'Standby' });
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
    const response = await client.instances.snapshots.create('id', {
      kind: 'Standby',
      name: 'pre-upgrade',
      tags: { team: 'backend', env: 'staging' },
    });
  });

  // Mock server tests are disabled
  test.skip('restore: only required params', async () => {
    const responsePromise = client.instances.snapshots.restore('snapshotId', { id: 'id' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('restore: required and optional params', async () => {
    const response = await client.instances.snapshots.restore('snapshotId', {
      id: 'id',
      target_hypervisor: 'qemu',
      target_state: 'Running',
    });
  });
});
