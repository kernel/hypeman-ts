// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Pushes extends APIResource {
  /**
   * Creates a push job that exports a hypeman image from the local OCI cache to a
   * remote registry (e.g. AWS ECR, Docker Hub). Only images in the ready state can
   * be pushed.
   *
   * @example
   * ```ts
   * const push = await client.pushes.create({
   *   image: 'docker.io/library/alpine:latest',
   *   target:
   *     '123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1',
   * });
   * ```
   */
  create(body: PushCreateParams, options?: RequestOptions): APIPromise<Push> {
    return this._client.post('/pushes', { body, ...options });
  }

  /**
   * Lists outbound image push jobs, newest first.
   *
   * @example
   * ```ts
   * const pushes = await client.pushes.list();
   * ```
   */
  list(options?: RequestOptions): APIPromise<PushListResponse> {
    return this._client.get('/pushes', options);
  }

  /**
   * Get push details
   *
   * @example
   * ```ts
   * const push = await client.pushes.get('id');
   * ```
   */
  get(id: string, options?: RequestOptions): APIPromise<Push> {
    return this._client.get(path`/pushes/${id}`, options);
  }
}

export interface CreatePushRequest {
  /**
   * Hypeman image name to push (tag or digest form)
   */
  image: string;

  /**
   * Full remote reference to push to
   */
  target: string;

  /**
   * Docker-style registry credentials borrowed for one image pull or push request.
   * They remain in memory and are never persisted or logged. When omitted or empty,
   * the server's own registry credentials are used. An interrupted credentialed
   * operation must be retried with fresh credentials.
   */
  credentials?: PushCredentials;

  /**
   * Allow pushing to plain-HTTP registries
   */
  insecure?: boolean;
}

export interface Push {
  /**
   * Push job identifier
   */
  id: string;

  created_at: string;

  /**
   * Cached manifest digest being pushed
   */
  digest: string;

  /**
   * Hypeman image name (normalized ref)
   */
  image: string;

  status: PushStatus;

  /**
   * Remote reference the image is pushed to
   */
  target: string;

  /**
   * Total compressed layer bytes pushed
   */
  bytes?: number;

  completed_at?: string | null;

  /**
   * Error message
   */
  error?: string | null;

  /**
   * Number of layers pushed
   */
  layers?: number;

  /**
   * Position in the push queue
   */
  queue_position?: number | null;
}

/**
 * Docker-style registry credentials borrowed for one image pull or push request.
 * They remain in memory and are never persisted or logged. When omitted or empty,
 * the server's own registry credentials are used. An interrupted credentialed
 * operation must be retried with fresh credentials.
 */
export interface PushCredentials {
  /**
   * Registry password or access token
   */
  password?: string;

  /**
   * Bearer token for an Authorization header
   */
  registry_token?: string;

  /**
   * Registry username
   */
  username?: string;
}

export type PushStatus = 'queued' | 'pushing' | 'pushed' | 'failed';

export type PushListResponse = Array<Push>;

export interface PushCreateParams {
  /**
   * Hypeman image name to push (tag or digest form)
   */
  image: string;

  /**
   * Full remote reference to push to
   */
  target: string;

  /**
   * Docker-style registry credentials borrowed for one image pull or push request.
   * They remain in memory and are never persisted or logged. When omitted or empty,
   * the server's own registry credentials are used. An interrupted credentialed
   * operation must be retried with fresh credentials.
   */
  credentials?: PushCredentials;

  /**
   * Allow pushing to plain-HTTP registries
   */
  insecure?: boolean;
}

export declare namespace Pushes {
  export {
    type CreatePushRequest as CreatePushRequest,
    type Push as Push,
    type PushCredentials as PushCredentials,
    type PushStatus as PushStatus,
    type PushListResponse as PushListResponse,
    type PushCreateParams as PushCreateParams,
  };
}
