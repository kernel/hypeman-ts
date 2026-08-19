// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Capabilities extends APIResource {
  /**
   * Returns machine-readable host capabilities: server and API version, host
   * OS/architecture, every runtime available on this host with its per-runtime
   * feature IDs, the configured default runtime and whether it is available, guest
   * networking model and host gateway, supported image platforms, and stable
   * server-level feature IDs.
   *
   * Runtime-derived values reflect the actual host (for example, snapshot and
   * standby support on macOS is gated on the host OS version), so clients can gate
   * behavior on capabilities without hard-coding hypervisor knowledge.
   */
  get(options?: RequestOptions): APIPromise<Capabilities> {
    return this._client.get('/capabilities', options);
  }
}

export interface Capabilities {
  default_runtime: CapabilitiesDefaultRuntime;

  /**
   * Stable server-level feature IDs: API surfaces this server exposes regardless of
   * which runtime backs an instance. Always present: "instances", "images",
   * "builds", "volumes", "ingress", "exec", "logs". Host-conditional: "devices"
   * (device passthrough management, Linux hosts only) and "rosetta-emulation" (Apple
   * Silicon macOS hosts with Rosetta currently installed, per the same availability
   * probe launches enforce). Per-runtime features are reported under each runtimes[]
   * entry.
   */
  features: Array<string>;

  host: CapabilitiesHost;

  images: CapabilitiesImages;

  network: CapabilitiesNetwork;

  /**
   * Every runtime this server build supports on this host platform, each with its
   * own availability flag and feature IDs. Hosts commonly support several runtimes
   * at once (for example cloud-hypervisor, firecracker, qemu, and qemu-microvm on
   * linux/amd64). A listed runtime is only launchable when its "available" flag is
   * true. Entries are sorted by name.
   */
  runtimes: Array<CapabilitiesRuntime>;

  server: CapabilitiesServer;
}

export interface CapabilitiesDefaultRuntime {
  /**
   * Whether the default runtime can launch on this host: it appears in runtimes and
   * its launch prerequisites are met (matches that entry's "available"). When false,
   * launches that rely on the default will fail until the server is reconfigured
   * with an available runtime or the missing prerequisite (for example the QEMU
   * system binary) is installed.
   */
  available: boolean;

  /**
   * Runtime used for launches that do not name one
   */
  name: string;
}

export interface CapabilitiesHost {
  /**
   * Host CPU architecture
   */
  arch: string;

  /**
   * Host operating system
   */
  os: string;
}

export interface CapabilitiesImages {
  /**
   * Image platform selected when a create request omits one
   */
  default_platform: string;

  /**
   * Image platforms (os/arch) this host can run. On Apple Silicon macOS this
   * includes linux/amd64 only when Rosetta is currently installed — probed via the
   * same Virtualization.framework availability check launches enforce — so a listed
   * platform is launchable right now. Install Rosetta (softwareupdate
   * --install-rosetta) to enable it.
   */
  platforms: Array<string>;
}

export interface CapabilitiesNetwork {
  /**
   * Whether direct VM-to-VM traffic is permitted on the default network
   */
  guest_to_guest: boolean;

  /**
   * Guest networking model. "bridge" is a Linux bridge with per-VM TAP devices;
   * "nat" is hypervisor-provided NAT (macOS).
   */
  model: 'bridge' | 'nat';

  /**
   * Guest-visible host gateway IP. Guests reach host services (including host
   * ingress) through this address. Omitted when no default network has been resolved
   * on this host yet.
   */
  gateway?: string;

  /**
   * Guest subnet CIDR
   */
  subnet?: string;
}

export interface CapabilitiesRuntime {
  /**
   * Whether this runtime's launch prerequisites are currently met on this host.
   * Listed runtimes are supported by this server build on this platform;
   * available=false means a host prerequisite is missing (for example qemu requires
   * a runnable system-installed QEMU binary and the host vhost-vsock device) and
   * launches naming this runtime will fail until it is installed.
   */
  available: boolean;

  /**
   * Stable feature IDs supported by this runtime on this host: "snapshots"
   * (snapshot/restore), "standby" (pause + memory snapshot, with later restore),
   * "fork" (clone an instance from a stopped source; forking a standby or running
   * source restores/creates snapshots and additionally requires "standby"), "pause"
   * (pause/resume), "hotplug-memory" (live memory resize), "balloon-control"
   * (runtime balloon target changes), "vsock" (guest vsock communication),
   * "gpu-passthrough" (GPU/PCI device passthrough), "disk-io-limit" (disk I/O rate
   * limiting), "disk-resize" (live disk resize). Values are host- and
   * configuration-truthful: vz omits snapshots and standby on macOS 13, which lacks
   * Virtualization.framework VM save/restore, while still advertising fork
   * (stopped-source clones need no save/restore there), and cloud-hypervisor reports
   * "disk-resize" only when the configured default version supports it.
   */
  features: Array<string>;

  /**
   * Runtime identifier
   */
  name: string;
}

export interface CapabilitiesServer {
  /**
   * API contract version (matches the OpenAPI document info version)
   */
  api_version: string;

  /**
   * Server build version (short git revision, with "-dirty" suffix for uncommitted
   * builds, or "unknown")
   */
  version: string;
}

export declare namespace Capabilities {
  export {
    type Capabilities as Capabilities,
    type CapabilitiesDefaultRuntime as CapabilitiesDefaultRuntime,
    type CapabilitiesHost as CapabilitiesHost,
    type CapabilitiesImages as CapabilitiesImages,
    type CapabilitiesNetwork as CapabilitiesNetwork,
    type CapabilitiesRuntime as CapabilitiesRuntime,
    type CapabilitiesServer as CapabilitiesServer,
  };
}
