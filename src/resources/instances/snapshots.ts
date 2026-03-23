// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as SnapshotsAPI from '../snapshots';
import * as InstancesAPI from './instances';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Snapshots extends APIResource {
  /**
   * Create a snapshot for an instance
   *
   * @example
   * ```ts
   * const snapshot = await client.instances.snapshots.create(
   *   'id',
   *   { kind: 'Standby' },
   * );
   * ```
   */
  create(
    id: string,
    body: SnapshotCreateParams,
    options?: RequestOptions,
  ): APIPromise<SnapshotsAPI.Snapshot> {
    return this._client.post(path`/instances/${id}/snapshots`, { body, ...options });
  }

  /**
   * Restore an instance from a snapshot in-place
   *
   * @example
   * ```ts
   * const instance = await client.instances.snapshots.restore(
   *   'snapshotId',
   *   { id: 'id' },
   * );
   * ```
   */
  restore(
    snapshotID: string,
    params: SnapshotRestoreParams,
    options?: RequestOptions,
  ): APIPromise<InstancesAPI.Instance> {
    const { id, ...body } = params;
    return this._client.post(path`/instances/${id}/snapshots/${snapshotID}/restore`, { body, ...options });
  }
}

export interface SnapshotCreateParams {
  /**
   * Snapshot capture kind
   */
  kind: SnapshotsAPI.SnapshotKind;

  /**
   * Compression settings to use for this snapshot. Overrides instance and server
   * defaults.
   */
  compression?: Shared.SnapshotCompressionConfig;

  /**
   * Optional snapshot name (lowercase letters, digits, and dashes only; cannot start
   * or end with a dash)
   */
  name?: string;

  /**
   * User-defined key-value tags.
   */
  tags?: { [key: string]: string };
}

export interface SnapshotRestoreParams {
  /**
   * Path param: Source instance ID or name
   */
  id: string;

  /**
   * Body param: Optional hypervisor override. Allowed only when restoring from a
   * Stopped snapshot. Standby snapshots must restore with their original hypervisor.
   */
  target_hypervisor?: 'cloud-hypervisor' | 'firecracker' | 'qemu' | 'vz';

  /**
   * Body param: Optional final state after restore. Defaults by snapshot kind:
   *
   * - Standby snapshot defaults to Running
   * - Stopped snapshot defaults to Stopped
   */
  target_state?: 'Stopped' | 'Standby' | 'Running';
}

export declare namespace Snapshots {
  export {
    type SnapshotCreateParams as SnapshotCreateParams,
    type SnapshotRestoreParams as SnapshotRestoreParams,
  };
}
