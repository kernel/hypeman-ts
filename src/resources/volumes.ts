// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Volumes extends APIResource {
  /**
   * Creates a new empty volume of the specified size.
   *
   * @example
   * ```ts
   * const volume = await client.volumes.create({
   *   name: 'my-data-volume',
   *   size_gb: 10,
   * });
   * ```
   */
  create(body: VolumeCreateParams, options?: RequestOptions): APIPromise<Volume> {
    return this._client.post('/volumes', { body, ...options });
  }

  /**
   * List volumes
   *
   * @example
   * ```ts
   * const volumes = await client.volumes.list();
   * ```
   */
  list(
    query: VolumeListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<VolumeListResponse> {
    return this._client.get('/volumes', { query, ...options });
  }

  /**
   * Delete volume
   *
   * @example
   * ```ts
   * await client.volumes.delete('id');
   * ```
   */
  delete(id: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/volumes/${id}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Creates a new volume pre-populated with content from a tar.gz archive. The
   * archive is streamed directly into the volume's root directory.
   *
   * @example
   * ```ts
   * const volume = await client.volumes.createFromArchive(
   *   fs.createReadStream('path/to/file'),
   *   { name: 'name', size_gb: 0 },
   * );
   * ```
   */
  createFromArchive(
    body: string | ArrayBuffer | ArrayBufferView | Blob | DataView,
    params: VolumeCreateFromArchiveParams,
    options?: RequestOptions,
  ): APIPromise<Volume> {
    const { name, size_gb, id, tags } = params;
    return this._client.post('/volumes/from-archive', {
      body: body,
      query: { name, size_gb, id, tags },
      ...options,
      headers: buildHeaders([{ 'Content-Type': 'application/gzip' }, options?.headers]),
    });
  }

  /**
   * Get volume details
   *
   * @example
   * ```ts
   * const volume = await client.volumes.get('id');
   * ```
   */
  get(id: string, options?: RequestOptions): APIPromise<Volume> {
    return this._client.get(path`/volumes/${id}`, options);
  }
}

export interface Volume {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Creation timestamp (RFC3339)
   */
  created_at: string;

  /**
   * Volume name
   */
  name: string;

  /**
   * Size in gigabytes
   */
  size_gb: number;

  /**
   * List of current attachments (empty if not attached)
   */
  attachments?: Array<VolumeAttachment>;

  /**
   * User-defined key-value tags.
   */
  tags?: { [key: string]: string };
}

export interface VolumeAttachment {
  /**
   * ID of the instance this volume is attached to
   */
  instance_id: string;

  /**
   * Mount path in the guest
   */
  mount_path: string;

  /**
   * Whether the attachment is read-only
   */
  readonly: boolean;
}

export type VolumeListResponse = Array<Volume>;

export interface VolumeCreateParams {
  /**
   * Volume name
   */
  name: string;

  /**
   * Size in gigabytes
   */
  size_gb: number;

  /**
   * Optional custom identifier (auto-generated if not provided)
   */
  id?: string;

  /**
   * User-defined key-value tags.
   */
  tags?: { [key: string]: string };
}

export interface VolumeListParams {
  /**
   * Filter volumes by tag key-value pairs.
   */
  tags?: { [key: string]: string };
}

export interface VolumeCreateFromArchiveParams {
  /**
   * Query param: Volume name
   */
  name: string;

  /**
   * Query param: Maximum size in GB (extraction fails if content exceeds this)
   */
  size_gb: number;

  /**
   * Query param: Optional custom volume ID (auto-generated if not provided)
   */
  id?: string;

  /**
   * Query param: Tags for the created volume.
   */
  tags?: { [key: string]: string };
}

export declare namespace Volumes {
  export {
    type Volume as Volume,
    type VolumeAttachment as VolumeAttachment,
    type VolumeListResponse as VolumeListResponse,
    type VolumeCreateParams as VolumeCreateParams,
    type VolumeListParams as VolumeListParams,
    type VolumeCreateFromArchiveParams as VolumeCreateFromArchiveParams,
  };
}
