// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Hypeman from '@onkernel/hypeman';

const client = new Hypeman({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource volumes', () => {
  // Mock server tests are disabled
  test.skip('attach: only required params', async () => {
    const responsePromise = client.instances.volumes.attach('volumeId', {
      id: 'id',
      mount_path: '/mnt/data',
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
  test.skip('attach: required and optional params', async () => {
    const response = await client.instances.volumes.attach('volumeId', {
      id: 'id',
      mount_path: '/mnt/data',
      readonly: true,
    });
  });

  // Mock server tests are disabled
  test.skip('detach: only required params', async () => {
    const responsePromise = client.instances.volumes.detach('volumeId', { id: 'id' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('detach: required and optional params', async () => {
    const response = await client.instances.volumes.detach('volumeId', { id: 'id' });
  });
});
