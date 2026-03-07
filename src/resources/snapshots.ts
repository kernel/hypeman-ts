// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import * as InstancesAPI from './instances/instances';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Snapshots extends APIResource {
  /**
   * List snapshots
   *
   * @example
   * ```ts
   * const snapshots = await client.snapshots.list();
   * ```
   */
  list(
    query: SnapshotListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<SnapshotListResponse> {
    return this._client.get('/snapshots', { query, ...options });
  }

  /**
   * Delete a snapshot
   *
   * @example
   * ```ts
   * await client.snapshots.delete('snapshotId');
   * ```
   */
  delete(snapshotID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/snapshots/${snapshotID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Fork a new instance from a snapshot
   *
   * @example
   * ```ts
   * const instance = await client.snapshots.fork('snapshotId', {
   *   name: 'nginx-from-snap',
   * });
   * ```
   */
  fork(
    snapshotID: string,
    body: SnapshotForkParams,
    options?: RequestOptions,
  ): APIPromise<InstancesAPI.Instance> {
    return this._client.post(path`/snapshots/${snapshotID}/fork`, { body, ...options });
  }

  /**
   * Get snapshot details
   *
   * @example
   * ```ts
   * const snapshot = await client.snapshots.get('snapshotId');
   * ```
   */
  get(snapshotID: string, options?: RequestOptions): APIPromise<Snapshot> {
    return this._client.get(path`/snapshots/${snapshotID}`, options);
  }
}

export interface Snapshot {
  /**
   * Auto-generated unique snapshot identifier
   */
  id: string;

  /**
   * Snapshot creation timestamp
   */
  created_at: string;

  /**
   * Snapshot capture kind
   */
  kind: SnapshotKind;

  /**
   * Total payload size in bytes
   */
  size_bytes: number;

  /**
   * Source instance hypervisor at snapshot creation time
   */
  source_hypervisor: 'cloud-hypervisor' | 'firecracker' | 'qemu' | 'vz';

  /**
   * Source instance ID at snapshot creation time
   */
  source_instance_id: string;

  /**
   * Source instance name at snapshot creation time
   */
  source_instance_name: string;

  /**
   * User-defined key-value metadata tags.
   */
  metadata?: { [key: string]: string };

  /**
   * Optional human-readable snapshot name (unique per source instance)
   */
  name?: string | null;
}

/**
 * Snapshot capture kind
 */
export type SnapshotKind = 'Standby' | 'Stopped';

export type SnapshotListResponse = Array<Snapshot>;

export interface SnapshotListParams {
  /**
   * Filter snapshots by kind
   */
  kind?: SnapshotKind;

  /**
   * Filter snapshots by metadata key-value pairs.
   */
  metadata?: { [key: string]: string };

  /**
   * Filter snapshots by snapshot name
   */
  name?: string;

  /**
   * Filter snapshots by source instance ID
   */
  source_instance_id?: string;
}

export interface SnapshotForkParams {
  /**
   * Name for the new instance (lowercase letters, digits, and dashes only; cannot
   * start or end with a dash)
   */
  name: string;

  /**
   * Optional hypervisor override. Allowed only when forking from a Stopped snapshot.
   * Standby snapshots must fork with their original hypervisor.
   */
  target_hypervisor?: 'cloud-hypervisor' | 'firecracker' | 'qemu' | 'vz';

  /**
   * Optional final state for the forked instance. Defaults by snapshot kind:
   *
   * - Standby snapshot defaults to Running
   * - Stopped snapshot defaults to Stopped
   */
  target_state?: 'Stopped' | 'Standby' | 'Running';
}

export declare namespace Snapshots {
  export {
    type Snapshot as Snapshot,
    type SnapshotKind as SnapshotKind,
    type SnapshotListResponse as SnapshotListResponse,
    type SnapshotListParams as SnapshotListParams,
    type SnapshotForkParams as SnapshotForkParams,
  };
}
