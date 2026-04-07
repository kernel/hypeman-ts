// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as InstancesAPI from './instances';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class AutoStandby extends APIResource {
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
