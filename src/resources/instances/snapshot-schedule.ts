// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as InstancesAPI from './instances';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class SnapshotSchedule extends APIResource {
  /**
   * Scheduled runs automatically choose snapshot behavior from current instance
   * state:
   *
   * - `Running` or `Standby` source: create a `Standby` snapshot.
   * - `Stopped` source: create a `Stopped` snapshot. For running instances, this
   *   includes a brief pause/resume cycle during each capture. The minimum supported
   *   interval is `1m`, but larger intervals are recommended for heavier or
   *   latency-sensitive workloads. Updating only retention, metadata, or
   *   `name_prefix` preserves the next scheduled run; changing `interval`
   *   establishes a new cadence.
   *
   * @example
   * ```ts
   * const snapshotSchedule =
   *   await client.instances.snapshotSchedule.update('id', {
   *     interval: '24h',
   *     retention: {},
   *   });
   * ```
   */
  update(
    id: string,
    body: SnapshotScheduleUpdateParams,
    options?: RequestOptions,
  ): APIPromise<InstancesAPI.SnapshotSchedule> {
    return this._client.put(path`/instances/${id}/snapshot-schedule`, { body, ...options });
  }

  /**
   * Delete snapshot schedule for an instance
   *
   * @example
   * ```ts
   * await client.instances.snapshotSchedule.delete('id');
   * ```
   */
  delete(id: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/instances/${id}/snapshot-schedule`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Get snapshot schedule for an instance
   *
   * @example
   * ```ts
   * const snapshotSchedule =
   *   await client.instances.snapshotSchedule.get('id');
   * ```
   */
  get(id: string, options?: RequestOptions): APIPromise<InstancesAPI.SnapshotSchedule> {
    return this._client.get(path`/instances/${id}/snapshot-schedule`, options);
  }
}

export interface SnapshotScheduleUpdateParams {
  /**
   * Snapshot interval (Go duration format, minimum 1m).
   */
  interval: string;

  /**
   * At least one of max_count or max_age must be provided.
   */
  retention: InstancesAPI.SnapshotScheduleRetention;

  /**
   * User-defined key-value tags.
   */
  metadata?: { [key: string]: string };

  /**
   * Optional prefix for auto-generated scheduled snapshot names (max 47 chars).
   */
  name_prefix?: string | null;
}

export declare namespace SnapshotSchedule {
  export { type SnapshotScheduleUpdateParams as SnapshotScheduleUpdateParams };
}
