// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Resources extends APIResource {
  /**
   * Returns current host resource capacity, allocation status, and per-instance
   * breakdown. Resources include CPU, memory, disk, and network. Oversubscription
   * ratios are applied to calculate effective limits.
   *
   * @example
   * ```ts
   * const resources = await client.resources.get();
   * ```
   */
  get(options?: RequestOptions): APIPromise<Resources> {
    return this._client.get('/resources', options);
  }

  /**
   * Requests runtime balloon inflation across reclaim-eligible guests. The same
   * planner used by host-pressure reclaim is applied, including protected floors and
   * per-VM step limits.
   *
   * @example
   * ```ts
   * const memoryReclaimResponse =
   *   await client.resources.reclaimMemory({
   *     reclaim_bytes: 536870912,
   *   });
   * ```
   */
  reclaimMemory(
    body: ResourceReclaimMemoryParams,
    options?: RequestOptions,
  ): APIPromise<MemoryReclaimResponse> {
    return this._client.post('/resources/memory/reclaim', { body, ...options });
  }
}

export interface DiskBreakdown {
  /**
   * Disk used by exported rootfs images
   */
  images_bytes?: number;

  /**
   * Disk used by OCI layer cache (shared blobs)
   */
  oci_cache_bytes?: number;

  /**
   * Disk used by instance overlays (rootfs + volume overlays)
   */
  overlays_bytes?: number;

  /**
   * Disk used by volumes
   */
  volumes_bytes?: number;
}

/**
 * Available vGPU profile
 */
export interface GPUProfile {
  /**
   * Number of instances that can be created with this profile
   */
  available: number;

  /**
   * Frame buffer size in MB
   */
  framebuffer_mb: number;

  /**
   * Profile name (user-facing)
   */
  name: string;
}

/**
 * GPU resource status. Null if no GPUs available.
 */
export interface GPUResourceStatus {
  /**
   * GPU mode (vgpu for SR-IOV/mdev, passthrough for whole GPU)
   */
  mode: 'vgpu' | 'passthrough';

  /**
   * Total slots (VFs for vGPU, physical GPUs for passthrough)
   */
  total_slots: number;

  /**
   * Slots currently in use
   */
  used_slots: number;

  /**
   * Physical GPUs (only in passthrough mode)
   */
  devices?: Array<PassthroughDevice>;

  /**
   * Available vGPU profiles (only in vGPU mode)
   */
  profiles?: Array<GPUProfile>;
}

export interface MemoryReclaimAction {
  applied_reclaim_bytes: number;

  assigned_memory_bytes: number;

  hypervisor: 'cloud-hypervisor' | 'firecracker' | 'qemu' | 'vz';

  instance_id: string;

  instance_name: string;

  planned_target_guest_memory_bytes: number;

  previous_target_guest_memory_bytes: number;

  protected_floor_bytes: number;

  /**
   * Result of this VM's reclaim step.
   */
  status: string;

  target_guest_memory_bytes: number;

  /**
   * Error message when status is error or unsupported.
   */
  error?: string;
}

export interface MemoryReclaimRequest {
  /**
   * Total bytes of guest memory to reclaim across eligible VMs.
   */
  reclaim_bytes: number;

  /**
   * Calculate a reclaim plan without applying balloon changes or creating a hold.
   */
  dry_run?: boolean;

  /**
   * How long to keep the reclaim hold active (Go duration string). Defaults to 5m
   * when omitted.
   */
  hold_for?: string;

  /**
   * Optional operator-provided reason attached to logs and traces.
   */
  reason?: string;
}

export interface MemoryReclaimResponse {
  actions: Array<MemoryReclaimAction>;

  applied_reclaim_bytes: number;

  host_available_bytes: number;

  host_pressure_state: 'healthy' | 'pressure';

  planned_reclaim_bytes: number;

  requested_reclaim_bytes: number;

  /**
   * When the current manual reclaim hold expires.
   */
  hold_until?: string;
}

/**
 * Physical GPU available for passthrough
 */
export interface PassthroughDevice {
  /**
   * Whether this GPU is available (not attached to an instance)
   */
  available: boolean;

  /**
   * GPU name
   */
  name: string;
}

export interface ResourceAllocation {
  /**
   * vCPUs allocated
   */
  cpu?: number;

  /**
   * Disk allocated in bytes (overlay + volumes)
   */
  disk_bytes?: number;

  /**
   * Disk I/O bandwidth limit in bytes/sec
   */
  disk_io_bps?: number;

  /**
   * Instance identifier
   */
  instance_id?: string;

  /**
   * Instance name
   */
  instance_name?: string;

  /**
   * Memory allocated in bytes
   */
  memory_bytes?: number;

  /**
   * Download bandwidth limit in bytes/sec (external→VM)
   */
  network_download_bps?: number;

  /**
   * Upload bandwidth limit in bytes/sec (VM→external)
   */
  network_upload_bps?: number;
}

export interface ResourceStatus {
  /**
   * Currently allocated resources
   */
  allocated: number;

  /**
   * Available for allocation (effective_limit - allocated)
   */
  available: number;

  /**
   * Raw host capacity
   */
  capacity: number;

  /**
   * Capacity after oversubscription (capacity \* ratio)
   */
  effective_limit: number;

  /**
   * Oversubscription ratio applied
   */
  oversub_ratio: number;

  /**
   * Resource type
   */
  type: string;

  /**
   * How capacity was determined (detected, configured)
   */
  source?: string;
}

export interface Resources {
  allocations: Array<ResourceAllocation>;

  cpu: ResourceStatus;

  disk: ResourceStatus;

  memory: ResourceStatus;

  network: ResourceStatus;

  disk_breakdown?: DiskBreakdown;

  disk_io?: ResourceStatus;

  /**
   * GPU resource status. Null if no GPUs available.
   */
  gpu?: GPUResourceStatus | null;
}

export interface ResourceReclaimMemoryParams {
  /**
   * Total bytes of guest memory to reclaim across eligible VMs.
   */
  reclaim_bytes: number;

  /**
   * Calculate a reclaim plan without applying balloon changes or creating a hold.
   */
  dry_run?: boolean;

  /**
   * How long to keep the reclaim hold active (Go duration string). Defaults to 5m
   * when omitted.
   */
  hold_for?: string;

  /**
   * Optional operator-provided reason attached to logs and traces.
   */
  reason?: string;
}

export declare namespace Resources {
  export {
    type DiskBreakdown as DiskBreakdown,
    type GPUProfile as GPUProfile,
    type GPUResourceStatus as GPUResourceStatus,
    type MemoryReclaimAction as MemoryReclaimAction,
    type MemoryReclaimRequest as MemoryReclaimRequest,
    type MemoryReclaimResponse as MemoryReclaimResponse,
    type PassthroughDevice as PassthroughDevice,
    type ResourceAllocation as ResourceAllocation,
    type ResourceStatus as ResourceStatus,
    type Resources as Resources,
    type ResourceReclaimMemoryParams as ResourceReclaimMemoryParams,
  };
}
