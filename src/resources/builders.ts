// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Builders extends APIResource {
  /**
   * Creates a builder and its cache disk. One build at a time runs per builder.
   *
   * @example
   * ```ts
   * const builder = await client.builders.create();
   * ```
   */
  create(body: BuilderCreateParams, options?: RequestOptions): APIPromise<Builder> {
    return this._client.post('/builders', { body, ...options });
  }

  /**
   * List builders
   *
   * @example
   * ```ts
   * const builders = await client.builders.list();
   * ```
   */
  list(
    query: BuilderListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<BuilderListResponse> {
    return this._client.get('/builders', { query, ...options });
  }

  /**
   * Permanently deletes a builder and its cache disk.
   *
   * @example
   * ```ts
   * await client.builders.delete('id');
   * ```
   */
  delete(id: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/builders/${id}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get builder details
   *
   * @example
   * ```ts
   * const builder = await client.builders.get('id');
   * ```
   */
  get(id: string, options?: RequestOptions): APIPromise<Builder> {
    return this._client.get(path`/builders/${id}`, options);
  }

  /**
   * Resets the builder's cache disk. The builder transitions to pruning, then ready.
   * Builder identity is preserved.
   *
   * @example
   * ```ts
   * const builder = await client.builders.prune('id');
   * ```
   */
  prune(id: string, options?: RequestOptions): APIPromise<Builder> {
    return this._client.post(path`/builders/${id}/prune`, options);
  }
}

export interface Builder {
  /**
   * Builder identifier
   */
  id: string;

  /**
   * Creation timestamp (RFC3339)
   */
  created_at: string;

  /**
   * Persistent builder cache disk size in gigabytes. Cannot be changed after
   * creation.
   */
  disk_size_gb: number;

  /**
   * Maximum concurrent builds on this builder. Currently fixed at 1.
   */
  max_concurrency: number;

  /**
   * Point-in-time IDs of queued builds waiting for this builder, oldest first
   */
  queued_builds: Array<string>;

  /**
   * Builder lifecycle status
   */
  status: BuilderStatus;

  /**
   * Point-in-time ID of the build currently running on this builder
   */
  active_build_id?: string | null;

  /**
   * When a build last ran on this builder
   */
  last_used_at?: string | null;

  /**
   * Optional non-unique display name
   */
  name?: string;

  /**
   * User-defined key-value tags.
   */
  tags?: { [key: string]: string };
}

/**
 * Builder lifecycle status
 */
export type BuilderStatus = 'ready' | 'pruning' | 'deleting' | 'error';

export type BuilderListResponse = Array<Builder>;

export interface BuilderCreateParams {
  /**
   * Optional caller-supplied identifier, auto-generated if not provided
   */
  id?: string;

  /**
   * Cache disk size in gigabytes. Omit to use the server default.
   */
  disk_size_gb?: number;

  /**
   * Optional non-unique display name
   */
  name?: string;

  /**
   * User-defined key-value tags.
   */
  tags?: { [key: string]: string };
}

export interface BuilderListParams {
  /**
   * Filter builders by tag key-value pairs.
   */
  tags?: { [key: string]: string };
}

export declare namespace Builders {
  export {
    type Builder as Builder,
    type BuilderStatus as BuilderStatus,
    type BuilderListResponse as BuilderListResponse,
    type BuilderCreateParams as BuilderCreateParams,
    type BuilderListParams as BuilderListParams,
  };
}
