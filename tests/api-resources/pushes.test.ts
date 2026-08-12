// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Hypeman from '@onkernel/hypeman';

const client = new Hypeman({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource pushes', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.pushes.create({
      image: 'docker.io/library/alpine:latest',
      target: '123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1',
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
    const response = await client.pushes.create({
      image: 'docker.io/library/alpine:latest',
      target: '123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1',
      credentials: {
        password: 'password',
        registry_token: 'registry_token',
        username: 'username',
      },
      insecure: true,
    });
  });

  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.pushes.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('get', async () => {
    const responsePromise = client.pushes.get('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
