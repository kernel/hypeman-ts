// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as AutoStandbyAPI from './auto-standby';
import { AutoStandby } from './auto-standby';
import * as SnapshotScheduleAPI from './snapshot-schedule';
import { SnapshotScheduleUpdateParams } from './snapshot-schedule';
import * as SnapshotsAPI from './snapshots';
import { SnapshotCreateParams, SnapshotRestoreParams, Snapshots } from './snapshots';
import * as VolumesAPI from './volumes';
import { VolumeAttachParams, VolumeDetachParams, Volumes } from './volumes';
import { APIPromise } from '../../core/api-promise';
import { Stream } from '../../core/streaming';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Instances extends APIResource {
  autoStandby: AutoStandbyAPI.AutoStandby = new AutoStandbyAPI.AutoStandby(this._client);
  volumes: VolumesAPI.Volumes = new VolumesAPI.Volumes(this._client);
  snapshots: SnapshotsAPI.Snapshots = new SnapshotsAPI.Snapshots(this._client);
  snapshotSchedule: SnapshotScheduleAPI.SnapshotSchedule = new SnapshotScheduleAPI.SnapshotSchedule(
    this._client,
  );

  /**
   * Create and start instance
   *
   * @example
   * ```ts
   * const instance = await client.instances.create({
   *   image: 'docker.io/library/alpine:latest',
   *   name: 'my-workload-1',
   * });
   * ```
   */
  create(body: InstanceCreateParams, options?: RequestOptions): APIPromise<Instance> {
    return this._client.post('/instances', { body, ...options });
  }

  /**
   * Update mutable properties of a running instance. Currently supports updating
   * only the environment variables referenced by existing credential policies,
   * enabling secret/key rotation without instance restart.
   *
   * @example
   * ```ts
   * const instance = await client.instances.update('id');
   * ```
   */
  update(id: string, body: InstanceUpdateParams, options?: RequestOptions): APIPromise<Instance> {
    return this._client.patch(path`/instances/${id}`, { body, ...options });
  }

  /**
   * List instances
   *
   * @example
   * ```ts
   * const instances = await client.instances.list();
   * ```
   */
  list(
    query: InstanceListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<InstanceListResponse> {
    return this._client.get('/instances', { query, ...options });
  }

  /**
   * Stop and delete instance
   *
   * @example
   * ```ts
   * await client.instances.delete('id');
   * ```
   */
  delete(id: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/instances/${id}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Fork an instance from stopped, standby, or running (with from_running=true)
   *
   * @example
   * ```ts
   * const instance = await client.instances.fork('id', {
   *   name: 'my-workload-1-fork',
   * });
   * ```
   */
  fork(id: string, body: InstanceForkParams, options?: RequestOptions): APIPromise<Instance> {
    return this._client.post(path`/instances/${id}/fork`, { body, ...options });
  }

  /**
   * Get instance details
   *
   * @example
   * ```ts
   * const instance = await client.instances.get('id');
   * ```
   */
  get(id: string, options?: RequestOptions): APIPromise<Instance> {
    return this._client.get(path`/instances/${id}`, options);
  }

  /**
   * Streams instance logs as Server-Sent Events. Use the `source` parameter to
   * select which log to stream:
   *
   * - `app` (default): Guest application logs (serial console)
   * - `vmm`: Cloud Hypervisor VMM logs
   * - `hypeman`: Hypeman operations log
   *
   * Returns the last N lines (controlled by `tail` parameter), then optionally
   * continues streaming new lines if `follow=true`.
   *
   * @example
   * ```ts
   * const response = await client.instances.logs('id');
   * ```
   */
  logs(
    id: string,
    query: InstanceLogsParams | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Stream<InstanceLogsResponse>> {
    return this._client.get(path`/instances/${id}/logs`, {
      query,
      ...options,
      headers: buildHeaders([{ Accept: 'text/event-stream' }, options?.headers]),
      stream: true,
    }) as APIPromise<Stream<InstanceLogsResponse>>;
  }

  /**
   * Restore instance from standby
   *
   * @example
   * ```ts
   * const instance = await client.instances.restore('id');
   * ```
   */
  restore(id: string, options?: RequestOptions): APIPromise<Instance> {
    return this._client.post(path`/instances/${id}/restore`, options);
  }

  /**
   * Put instance in standby (pause, snapshot, delete VMM)
   *
   * @example
   * ```ts
   * const instance = await client.instances.standby('id');
   * ```
   */
  standby(
    id: string,
    body: InstanceStandbyParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Instance> {
    return this._client.post(path`/instances/${id}/standby`, { body, ...options });
  }

  /**
   * Start a stopped instance
   *
   * @example
   * ```ts
   * const instance = await client.instances.start('id');
   * ```
   */
  start(id: string, body: InstanceStartParams, options?: RequestOptions): APIPromise<Instance> {
    return this._client.post(path`/instances/${id}/start`, { body, ...options });
  }

  /**
   * Returns information about a path in the guest filesystem. Useful for checking if
   * a path exists, its type, and permissions before performing file operations.
   *
   * @example
   * ```ts
   * const pathInfo = await client.instances.stat('id', {
   *   path: 'path',
   * });
   * ```
   */
  stat(id: string, query: InstanceStatParams, options?: RequestOptions): APIPromise<PathInfo> {
    return this._client.get(path`/instances/${id}/stat`, { query, ...options });
  }

  /**
   * Returns real-time resource utilization statistics for a running VM instance.
   * Metrics are collected from /proc/<pid>/stat and /proc/<pid>/statm for CPU and
   * memory, and from TAP interface statistics for network I/O.
   *
   * @example
   * ```ts
   * const instanceStats = await client.instances.stats('id');
   * ```
   */
  stats(id: string, options?: RequestOptions): APIPromise<InstanceStats> {
    return this._client.get(path`/instances/${id}/stats`, options);
  }

  /**
   * Stop instance (graceful shutdown)
   *
   * @example
   * ```ts
   * const instance = await client.instances.stop('id');
   * ```
   */
  stop(id: string, options?: RequestOptions): APIPromise<Instance> {
    return this._client.post(path`/instances/${id}/stop`, options);
  }

  /**
   * Blocks until the instance reaches the specified target state, the timeout
   * expires, or the instance enters a terminal/error state. Useful for avoiding
   * client-side polling when waiting for state transitions (e.g. waiting for an
   * instance to become Running).
   *
   * @example
   * ```ts
   * const waitForStateResponse = await client.instances.wait(
   *   'id',
   *   { state: 'Created' },
   * );
   * ```
   */
  wait(id: string, query: InstanceWaitParams, options?: RequestOptions): APIPromise<WaitForStateResponse> {
    return this._client.get(path`/instances/${id}/wait`, { query, ...options });
  }
}

/**
 * Linux-only automatic standby policy based on active inbound TCP connections
 * observed from the host conntrack table.
 */
export interface AutoStandbyPolicy {
  /**
   * Whether automatic standby is enabled for this instance.
   */
  enabled?: boolean;

  /**
   * How long the instance must have zero qualifying inbound TCP connections before
   * Hypeman places it into standby.
   */
  idle_timeout?: string;

  /**
   * Optional destination TCP ports that should not keep the instance awake.
   */
  ignore_destination_ports?: Array<number>;

  /**
   * Optional client CIDRs that should not keep the instance awake.
   */
  ignore_source_cidrs?: Array<string>;
}

export interface AutoStandbyStatus {
  /**
   * Number of currently tracked qualifying inbound TCP connections.
   */
  active_inbound_connections: number;

  /**
   * Whether the instance has any auto-standby policy configured.
   */
  configured: boolean;

  /**
   * Whether the instance is currently eligible to enter standby.
   */
  eligible: boolean;

  /**
   * Whether the configured auto-standby policy is enabled.
   */
  enabled: boolean;

  reason:
    | 'unsupported_platform'
    | 'policy_missing'
    | 'policy_disabled'
    | 'instance_not_running'
    | 'network_disabled'
    | 'missing_ip'
    | 'has_vgpu'
    | 'active_inbound_connections'
    | 'idle_timeout_not_elapsed'
    | 'observer_error'
    | 'ready_for_standby';

  status:
    | 'unsupported'
    | 'disabled'
    | 'ineligible'
    | 'active'
    | 'idle_countdown'
    | 'ready_for_standby'
    | 'standby_requested'
    | 'error';

  /**
   * Whether the current host platform supports auto-standby diagnostics.
   */
  supported: boolean;

  /**
   * Diagnostic identifier for the runtime tracking mode in use.
   */
  tracking_mode: string;

  /**
   * Remaining time before the controller attempts standby, when applicable.
   */
  countdown_remaining?: string | null;

  /**
   * When the controller most recently observed the instance become idle.
   */
  idle_since?: string | null;

  /**
   * Configured idle timeout from the auto-standby policy.
   */
  idle_timeout?: string | null;

  /**
   * Timestamp of the most recent qualifying inbound TCP activity the controller
   * observed.
   */
  last_inbound_activity_at?: string | null;

  /**
   * When the controller expects to attempt standby next, if a countdown is active.
   */
  next_standby_at?: string | null;
}

export interface Instance {
  /**
   * Auto-generated unique identifier (CUID2 format)
   */
  id: string;

  /**
   * Creation timestamp (RFC3339)
   */
  created_at: string;

  /**
   * OCI image reference
   */
  image: string;

  /**
   * Human-readable name
   */
  name: string;

  /**
   * Instance state:
   *
   * - Created: VMM created but not started (Cloud Hypervisor native)
   * - Initializing: VM is running while guest init is still in progress
   * - Running: Guest program has started and instance is ready
   * - Paused: VM is paused (Cloud Hypervisor native)
   * - Shutdown: VM shut down but VMM exists (Cloud Hypervisor native)
   * - Stopped: No VMM running, no snapshot exists
   * - Standby: No VMM running, snapshot exists (can be restored)
   * - Unknown: Failed to determine state (see state_error for details)
   */
  state: 'Created' | 'Initializing' | 'Running' | 'Paused' | 'Shutdown' | 'Stopped' | 'Standby' | 'Unknown';

  /**
   * Linux-only automatic standby policy based on active inbound TCP connections
   * observed from the host conntrack table.
   */
  auto_standby?: AutoStandbyPolicy;

  /**
   * Disk I/O rate limit (human-readable, e.g., "100MB/s")
   */
  disk_io_bps?: string;

  /**
   * Environment variables
   */
  env?: { [key: string]: string };

  /**
   * App exit code (null if VM hasn't exited)
   */
  exit_code?: number | null;

  /**
   * Human-readable description of exit (e.g., "command not found", "killed by signal
   * 9 (SIGKILL) - OOM")
   */
  exit_message?: string;

  /**
   * GPU information attached to the instance
   */
  gpu?: Instance.GPU;

  /**
   * Whether a snapshot exists for this instance
   */
  has_snapshot?: boolean;

  /**
   * Hotplug memory size (human-readable)
   */
  hotplug_size?: string;

  /**
   * Hypervisor running this instance
   */
  hypervisor?: 'cloud-hypervisor' | 'firecracker' | 'qemu' | 'vz';

  /**
   * Network configuration of the instance
   */
  network?: Instance.Network;

  /**
   * Writable overlay disk size (human-readable)
   */
  overlay_size?: string;

  /**
   * Base memory size (human-readable)
   */
  size?: string;

  snapshot_policy?: SnapshotPolicy;

  /**
   * Start timestamp (RFC3339)
   */
  started_at?: string | null;

  /**
   * Error message if state couldn't be determined (only set when state is Unknown)
   */
  state_error?: string | null;

  /**
   * Stop timestamp (RFC3339)
   */
  stopped_at?: string | null;

  /**
   * User-defined key-value tags.
   */
  tags?: { [key: string]: string };

  /**
   * Number of virtual CPUs
   */
  vcpus?: number;

  /**
   * Volumes attached to the instance
   */
  volumes?: Array<VolumeMount>;
}

export namespace Instance {
  /**
   * GPU information attached to the instance
   */
  export interface GPU {
    /**
     * mdev device UUID
     */
    mdev_uuid?: string;

    /**
     * vGPU profile name
     */
    profile?: string;
  }

  /**
   * Network configuration of the instance
   */
  export interface Network {
    /**
     * Download bandwidth limit (human-readable, e.g., "1Gbps", "125MB/s")
     */
    bandwidth_download?: string;

    /**
     * Upload bandwidth limit (human-readable, e.g., "1Gbps", "125MB/s")
     */
    bandwidth_upload?: string;

    /**
     * Whether instance is attached to the default network
     */
    enabled?: boolean;

    /**
     * Assigned IP address (null if no network)
     */
    ip?: string | null;

    /**
     * Assigned MAC address (null if no network)
     */
    mac?: string | null;

    /**
     * Network name (always "default" when enabled)
     */
    name?: string;
  }
}

/**
 * Real-time resource utilization statistics for a VM instance
 */
export interface InstanceStats {
  /**
   * Total memory allocated to the VM (Size + HotplugSize) in bytes
   */
  allocated_memory_bytes: number;

  /**
   * Number of vCPUs allocated to the VM
   */
  allocated_vcpus: number;

  /**
   * Total CPU time consumed by the VM hypervisor process in seconds
   */
  cpu_seconds: number;

  /**
   * Instance identifier
   */
  instance_id: string;

  /**
   * Instance name
   */
  instance_name: string;

  /**
   * Resident Set Size - actual physical memory used by the VM in bytes
   */
  memory_rss_bytes: number;

  /**
   * Virtual Memory Size - total virtual memory allocated in bytes
   */
  memory_vms_bytes: number;

  /**
   * Total network bytes received by the VM (from TAP interface)
   */
  network_rx_bytes: number;

  /**
   * Total network bytes transmitted by the VM (from TAP interface)
   */
  network_tx_bytes: number;

  /**
   * Memory utilization ratio (RSS / allocated memory). Only present when
   * allocated_memory_bytes > 0.
   */
  memory_utilization_ratio?: number | null;
}

export interface PathInfo {
  /**
   * Whether the path exists
   */
  exists: boolean;

  /**
   * Error message if stat failed (e.g., permission denied). Only set when exists is
   * false due to an error rather than the path not existing.
   */
  error?: string | null;

  /**
   * True if this is a directory
   */
  is_dir?: boolean;

  /**
   * True if this is a regular file
   */
  is_file?: boolean;

  /**
   * True if this is a symbolic link (only set when follow_links=false)
   */
  is_symlink?: boolean;

  /**
   * Symlink target path (only set when is_symlink=true)
   */
  link_target?: string | null;

  /**
   * File mode (Unix permissions)
   */
  mode?: number;

  /**
   * File size in bytes
   */
  size?: number;
}

export interface PortMapping {
  /**
   * Port in the guest VM
   */
  guest_port: number;

  /**
   * Port on the host
   */
  host_port: number;

  protocol?: 'tcp' | 'udp';
}

export interface SetSnapshotScheduleRequest {
  /**
   * Snapshot interval (Go duration format, minimum 1m).
   */
  interval: string;

  /**
   * At least one of max_count or max_age must be provided.
   */
  retention: SnapshotScheduleRetention;

  /**
   * User-defined key-value tags.
   */
  metadata?: { [key: string]: string };

  /**
   * Optional prefix for auto-generated scheduled snapshot names (max 47 chars).
   */
  name_prefix?: string | null;
}

export interface SnapshotPolicy {
  compression?: Shared.SnapshotCompressionConfig;
}

export interface SnapshotSchedule {
  /**
   * Schedule creation timestamp.
   */
  created_at: string;

  /**
   * Source instance ID.
   */
  instance_id: string;

  /**
   * Snapshot interval (Go duration format).
   */
  interval: string;

  /**
   * Next scheduled run time.
   */
  next_run_at: string;

  /**
   * Automatic cleanup policy for scheduled snapshots.
   */
  retention: SnapshotScheduleRetention;

  /**
   * Schedule update timestamp.
   */
  updated_at: string;

  /**
   * Last schedule run error, if any.
   */
  last_error?: string | null;

  /**
   * Last schedule execution time.
   */
  last_run_at?: string | null;

  /**
   * Snapshot ID produced by the last successful run.
   */
  last_snapshot_id?: string | null;

  /**
   * User-defined key-value tags.
   */
  metadata?: { [key: string]: string };

  /**
   * Optional prefix used for generated scheduled snapshot names.
   */
  name_prefix?: string | null;
}

/**
 * Automatic cleanup policy for scheduled snapshots.
 */
export interface SnapshotScheduleRetention {
  /**
   * Delete scheduled snapshots older than this duration (Go duration format).
   */
  max_age?: string;

  /**
   * Keep at most this many scheduled snapshots for the instance (0 disables
   * count-based cleanup).
   */
  max_count?: number;
}

export interface VolumeMount {
  /**
   * Path where volume is mounted in the guest
   */
  mount_path: string;

  /**
   * Volume identifier
   */
  volume_id: string;

  /**
   * Create per-instance overlay for writes (requires readonly=true)
   */
  overlay?: boolean;

  /**
   * Max overlay size as human-readable string (e.g., "1GB"). Required if
   * overlay=true.
   */
  overlay_size?: string;

  /**
   * Whether volume is mounted read-only
   */
  readonly?: boolean;
}

export interface WaitForStateResponse {
  /**
   * Current instance state when the wait completed
   */
  state: 'Created' | 'Initializing' | 'Running' | 'Paused' | 'Shutdown' | 'Stopped' | 'Standby' | 'Unknown';

  /**
   * Whether the timeout expired before the target state was reached
   */
  timed_out: boolean;

  /**
   * Error message when derived state is Unknown
   */
  state_error?: string | null;
}

export type InstanceListResponse = Array<Instance>;

export type InstanceLogsResponse = string;

export interface InstanceCreateParams {
  /**
   * OCI image reference
   */
  image: string;

  /**
   * Human-readable name (lowercase letters, digits, and dashes only; cannot start or
   * end with a dash)
   */
  name: string;

  /**
   * Linux-only automatic standby policy based on active inbound TCP connections
   * observed from the host conntrack table.
   */
  auto_standby?: AutoStandbyPolicy;

  /**
   * Override image CMD (like docker run <image> <command>). Omit to use image
   * default.
   */
  cmd?: Array<string>;

  /**
   * Host-managed credential brokering policies keyed by guest-visible env var name.
   * Those guest env vars receive mock placeholder values, while the real values
   * remain host-scoped in the request `env` map and are only materialized on the
   * mediated egress path according to each credential's `source` and `inject` rules.
   */
  credentials?: { [key: string]: InstanceCreateParams.Credentials };

  /**
   * Device IDs or names to attach for GPU/PCI passthrough
   */
  devices?: Array<string>;

  /**
   * Disk I/O rate limit (e.g., "100MB/s", "500MB/s"). Defaults to proportional share
   * based on CPU allocation if configured.
   */
  disk_io_bps?: string;

  /**
   * Override image entrypoint (like docker run --entrypoint). Omit to use image
   * default.
   */
  entrypoint?: Array<string>;

  /**
   * Environment variables
   */
  env?: { [key: string]: string };

  /**
   * GPU configuration for the instance
   */
  gpu?: InstanceCreateParams.GPU;

  /**
   * Additional memory for hotplug (human-readable format like "3GB", "1G"). Omit to
   * disable hotplug memory.
   */
  hotplug_size?: string;

  /**
   * Hypervisor to use for this instance. Defaults to server configuration.
   */
  hypervisor?: 'cloud-hypervisor' | 'firecracker' | 'qemu' | 'vz';

  /**
   * Network configuration for the instance
   */
  network?: InstanceCreateParams.Network;

  /**
   * Writable overlay disk size (human-readable format like "10GB", "50G")
   */
  overlay_size?: string;

  /**
   * Base memory size (human-readable format like "1GB", "512MB", "2G")
   */
  size?: string;

  /**
   * Skip guest-agent installation during boot. When true, the exec and stat APIs
   * will not work for this instance. The instance will still run, but remote command
   * execution will be unavailable.
   */
  skip_guest_agent?: boolean;

  /**
   * Skip kernel headers installation during boot for faster startup. When true, DKMS
   * (Dynamic Kernel Module Support) will not work, preventing compilation of
   * out-of-tree kernel modules (e.g., NVIDIA vGPU drivers). Recommended for
   * workloads that don't need kernel module compilation.
   */
  skip_kernel_headers?: boolean;

  /**
   * Snapshot compression policy for this instance. Controls compression settings
   * applied when creating snapshots or entering standby.
   */
  snapshot_policy?: SnapshotPolicy;

  /**
   * User-defined key-value tags.
   */
  tags?: { [key: string]: string };

  /**
   * Number of virtual CPUs
   */
  vcpus?: number;

  /**
   * Volumes to attach to the instance at creation time
   */
  volumes?: Array<VolumeMount>;
}

export namespace InstanceCreateParams {
  export interface Credentials {
    inject: Array<Credentials.Inject>;

    source: Credentials.Source;
  }

  export namespace Credentials {
    export interface Inject {
      /**
       * Current v1 transform shape. Header templating is supported now; other transform
       * types (for example request signing) can be added in future revisions.
       */
      as: Inject.As;

      /**
       * Optional destination host patterns (`api.example.com`, `*.example.com`). Omit to
       * allow injection on all destinations.
       */
      hosts?: Array<string>;
    }

    export namespace Inject {
      /**
       * Current v1 transform shape. Header templating is supported now; other transform
       * types (for example request signing) can be added in future revisions.
       */
      export interface As {
        /**
         * Template that must include `${value}`.
         */
        format: string;

        /**
         * Header name to set/mutate for matching outbound requests.
         */
        header: string;
      }
    }

    export interface Source {
      /**
       * Name of the real credential in the request `env` map. The guest-visible env var
       * key can receive a mock placeholder, while the mediated egress path resolves that
       * placeholder back to this real value only on the host.
       */
      env: string;
    }
  }

  /**
   * GPU configuration for the instance
   */
  export interface GPU {
    /**
     * vGPU profile name (e.g., "L40S-1Q"). Only used in vGPU mode.
     */
    profile?: string;
  }

  /**
   * Network configuration for the instance
   */
  export interface Network {
    /**
     * Download bandwidth limit (external→VM, e.g., "1Gbps", "125MB/s"). Defaults to
     * proportional share based on CPU allocation.
     */
    bandwidth_download?: string;

    /**
     * Upload bandwidth limit (VM→external, e.g., "1Gbps", "125MB/s"). Defaults to
     * proportional share based on CPU allocation.
     */
    bandwidth_upload?: string;

    /**
     * Host-mediated outbound network policy. Omit this object, or set
     * `enabled: false`, to preserve normal direct outbound networking when
     * `network.enabled` is true.
     */
    egress?: Network.Egress;

    /**
     * Whether to attach instance to the default network
     */
    enabled?: boolean;
  }

  export namespace Network {
    /**
     * Host-mediated outbound network policy. Omit this object, or set
     * `enabled: false`, to preserve normal direct outbound networking when
     * `network.enabled` is true.
     */
    export interface Egress {
      /**
       * Whether to enable the mediated egress path. When false or omitted, the instance
       * keeps normal direct outbound networking and host-managed credential rewriting is
       * disabled.
       */
      enabled?: boolean;

      /**
       * Egress enforcement policy applied when mediation is enabled.
       */
      enforcement?: Egress.Enforcement;
    }

    export namespace Egress {
      /**
       * Egress enforcement policy applied when mediation is enabled.
       */
      export interface Enforcement {
        /**
         * `all` (default) rejects direct non-mediated TCP egress from the VM, while
         * `http_https_only` rejects direct egress only on TCP ports 80 and 443.
         */
        mode?: 'all' | 'http_https_only';
      }
    }
  }
}

export interface InstanceUpdateParams {
  /**
   * Linux-only automatic standby policy based on active inbound TCP connections
   * observed from the host conntrack table.
   */
  auto_standby?: AutoStandbyPolicy;

  /**
   * Environment variables to update (merged with existing). Only keys referenced by
   * the instance's existing credential `source.env` bindings are accepted. Use this
   * to rotate real credential values without restarting the VM.
   */
  env?: { [key: string]: string };
}

export interface InstanceListParams {
  /**
   * Filter instances by state (e.g., Running, Stopped)
   */
  state?: 'Created' | 'Initializing' | 'Running' | 'Paused' | 'Shutdown' | 'Stopped' | 'Standby' | 'Unknown';

  /**
   * Filter instances by tag key-value pairs. Uses deepObject style:
   * ?tags[team]=backend&tags[env]=staging Multiple entries are ANDed together. All
   * specified key-value pairs must match.
   */
  tags?: { [key: string]: string };
}

export interface InstanceForkParams {
  /**
   * Name for the forked instance (lowercase letters, digits, and dashes only; cannot
   * start or end with a dash)
   */
  name: string;

  /**
   * Allow forking from a running source instance. When true and source is Running,
   * the source is put into standby, forked, then restored back to Running.
   */
  from_running?: boolean;

  /**
   * Optional final state for the forked instance. Default is the source instance
   * state at fork time. For example, forking from Running defaults the fork result
   * to Running.
   */
  target_state?: 'Stopped' | 'Standby' | 'Running';
}

export interface InstanceLogsParams {
  /**
   * Continue streaming new lines after initial output
   */
  follow?: boolean;

  /**
   * Log source to stream:
   *
   * - app: Guest application logs (serial console output)
   * - vmm: Cloud Hypervisor VMM logs (hypervisor stdout+stderr)
   * - hypeman: Hypeman operations log (actions taken on this instance)
   */
  source?: 'app' | 'vmm' | 'hypeman';

  /**
   * Number of lines to return from end
   */
  tail?: number;
}

export interface InstanceStandbyParams {
  compression?: Shared.SnapshotCompressionConfig;
}

export interface InstanceStartParams {
  /**
   * Override image CMD for this run. Omit to keep previous value.
   */
  cmd?: Array<string>;

  /**
   * Override image entrypoint for this run. Omit to keep previous value.
   */
  entrypoint?: Array<string>;
}

export interface InstanceStatParams {
  /**
   * Path to stat in the guest filesystem
   */
  path: string;

  /**
   * Follow symbolic links (like stat vs lstat)
   */
  follow_links?: boolean;
}

export interface InstanceWaitParams {
  /**
   * Target state to wait for
   */
  state: 'Created' | 'Initializing' | 'Running' | 'Paused' | 'Shutdown' | 'Stopped' | 'Standby' | 'Unknown';

  /**
   * Maximum duration to wait (Go duration format, e.g. "30s", "2m"). Capped at 5
   * minutes. Defaults to 60 seconds.
   */
  timeout?: string;
}

Instances.AutoStandby = AutoStandby;
Instances.Volumes = Volumes;
Instances.Snapshots = Snapshots;

export declare namespace Instances {
  export {
    type AutoStandbyPolicy as AutoStandbyPolicy,
    type AutoStandbyStatus as AutoStandbyStatus,
    type Instance as Instance,
    type InstanceStats as InstanceStats,
    type PathInfo as PathInfo,
    type PortMapping as PortMapping,
    type SetSnapshotScheduleRequest as SetSnapshotScheduleRequest,
    type SnapshotPolicy as SnapshotPolicy,
    type SnapshotSchedule as SnapshotSchedule,
    type SnapshotScheduleRetention as SnapshotScheduleRetention,
    type VolumeMount as VolumeMount,
    type WaitForStateResponse as WaitForStateResponse,
    type InstanceListResponse as InstanceListResponse,
    type InstanceLogsResponse as InstanceLogsResponse,
    type InstanceCreateParams as InstanceCreateParams,
    type InstanceUpdateParams as InstanceUpdateParams,
    type InstanceListParams as InstanceListParams,
    type InstanceForkParams as InstanceForkParams,
    type InstanceLogsParams as InstanceLogsParams,
    type InstanceStandbyParams as InstanceStandbyParams,
    type InstanceStartParams as InstanceStartParams,
    type InstanceStatParams as InstanceStatParams,
    type InstanceWaitParams as InstanceWaitParams,
  };

  export { AutoStandby as AutoStandby };

  export {
    Volumes as Volumes,
    type VolumeAttachParams as VolumeAttachParams,
    type VolumeDetachParams as VolumeDetachParams,
  };

  export {
    Snapshots as Snapshots,
    type SnapshotCreateParams as SnapshotCreateParams,
    type SnapshotRestoreParams as SnapshotRestoreParams,
  };

  export { type SnapshotScheduleUpdateParams as SnapshotScheduleUpdateParams };
}
