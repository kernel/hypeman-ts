// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as InstancesAPI from './instances';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class AutoStandby extends APIResource {
  /**
   * Places a hold that prevents the auto-standby controller from putting the
   * instance into standby before `hold_until`, and cancels any queued auto-standby
   * attempt.
   *
   * Each hold replaces the instance's previous hold, so `hold_until` always reflects
   * the most recent call. Holding again after the policy's `idle_timeout` is
   * shortened moves `hold_until` earlier.
   *
   * Callers may use this before opening a connection to a candidate-idle instance: a
   * 200 means it is safe to connect until `hold_until`; a 409 means the instance is
   * in standby (or irrevocably entering it) and must be restored first.
   *
   * Instances where auto-standby is disabled, unconfigured, or unsupported return
   * 200 with their current status because no auto-standby will occur.
   *
   * @example
   * ```ts
   * const autoStandbyStatus =
   *   await client.instances.autoStandby.hold('id');
   * ```
   */
  hold(id: string, options?: RequestOptions): APIPromise<InstancesAPI.AutoStandbyStatus> {
    return this._client.post(path`/instances/${id}/auto-standby/hold`, options);
  }

  /**
   * Get auto-standby diagnostic status
   *
   * @example
   * ```ts
   * const autoStandbyStatus =
   *   await client.instances.autoStandby.status('id');
   * ```
   */
  status(id: string, options?: RequestOptions): APIPromise<InstancesAPI.AutoStandbyStatus> {
    return this._client.get(path`/instances/${id}/auto-standby/status`, options);
  }
}
