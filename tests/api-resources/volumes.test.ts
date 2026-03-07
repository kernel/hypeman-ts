// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Hypeman, { toFile } from '@onkernel/hypeman';

const client = new Hypeman({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource volumes', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.volumes.create({ name: 'my-data-volume', size_gb: 10 });
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
    const response = await client.volumes.create({
      name: 'my-data-volume',
      size_gb: 10,
      id: 'vol-data-1',
      metadata: { team: 'backend', env: 'staging' },
    });
  });

  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.volumes.list();
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
      client.volumes.list(
        { metadata: { team: 'backend', env: 'staging' } },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Hypeman.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('delete', async () => {
    const responsePromise = client.volumes.delete('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('createFromArchive: only required params', async () => {
    const responsePromise = client.volumes.createFromArchive(
      await toFile(Buffer.from('Example data'), 'README.md'),
      { name: 'name', size_gb: 0 },
    );
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('createFromArchive: required and optional params', async () => {
    const response = await client.volumes.createFromArchive(
      await toFile(Buffer.from('Example data'), 'README.md'),
      {
        name: 'name',
        size_gb: 0,
        id: 'id',
        metadata: { team: 'backend', env: 'staging' },
      },
    );
  });

  // Mock server tests are disabled
  test.skip('get', async () => {
    const responsePromise = client.volumes.get('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
