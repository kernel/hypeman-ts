# Shared

Types:

- <code><a href="./src/resources/shared.ts">SnapshotCompressionConfig</a></code>

# Health

Types:

- <code><a href="./src/resources/health.ts">HealthCheckResponse</a></code>

Methods:

- <code title="get /health">client.health.<a href="./src/resources/health.ts">check</a>() -> HealthCheckResponse</code>

# Images

Types:

- <code><a href="./src/resources/images.ts">Image</a></code>
- <code><a href="./src/resources/images.ts">ImageListResponse</a></code>

Methods:

- <code title="post /images">client.images.<a href="./src/resources/images.ts">create</a>({ ...params }) -> Image</code>
- <code title="get /images">client.images.<a href="./src/resources/images.ts">list</a>({ ...params }) -> ImageListResponse</code>
- <code title="delete /images/{name}">client.images.<a href="./src/resources/images.ts">delete</a>(name) -> void</code>
- <code title="get /images/{name}">client.images.<a href="./src/resources/images.ts">get</a>(name) -> Image</code>

# Instances

Types:

- <code><a href="./src/resources/instances/instances.ts">AutoStandbyPolicy</a></code>
- <code><a href="./src/resources/instances/instances.ts">AutoStandbyStatus</a></code>
- <code><a href="./src/resources/instances/instances.ts">Instance</a></code>
- <code><a href="./src/resources/instances/instances.ts">InstanceStats</a></code>
- <code><a href="./src/resources/instances/instances.ts">PathInfo</a></code>
- <code><a href="./src/resources/instances/instances.ts">PortMapping</a></code>
- <code><a href="./src/resources/instances/instances.ts">SetSnapshotScheduleRequest</a></code>
- <code><a href="./src/resources/instances/instances.ts">SnapshotPolicy</a></code>
- <code><a href="./src/resources/instances/instances.ts">SnapshotSchedule</a></code>
- <code><a href="./src/resources/instances/instances.ts">SnapshotScheduleRetention</a></code>
- <code><a href="./src/resources/instances/instances.ts">StandbyInstanceRequest</a></code>
- <code><a href="./src/resources/instances/instances.ts">VolumeMount</a></code>
- <code><a href="./src/resources/instances/instances.ts">WaitForStateResponse</a></code>
- <code><a href="./src/resources/instances/instances.ts">InstanceListResponse</a></code>
- <code><a href="./src/resources/instances/instances.ts">InstanceLogsResponse</a></code>

Methods:

- <code title="post /instances">client.instances.<a href="./src/resources/instances/instances.ts">create</a>({ ...params }) -> Instance</code>
- <code title="patch /instances/{id}">client.instances.<a href="./src/resources/instances/instances.ts">update</a>(id, { ...params }) -> Instance</code>
- <code title="get /instances">client.instances.<a href="./src/resources/instances/instances.ts">list</a>({ ...params }) -> InstanceListResponse</code>
- <code title="delete /instances/{id}">client.instances.<a href="./src/resources/instances/instances.ts">delete</a>(id) -> void</code>
- <code title="post /instances/{id}/demote-template">client.instances.<a href="./src/resources/instances/instances.ts">demoteTemplate</a>(id) -> Instance</code>
- <code title="post /instances/{id}/fork">client.instances.<a href="./src/resources/instances/instances.ts">fork</a>(id, { ...params }) -> Instance</code>
- <code title="get /instances/{id}">client.instances.<a href="./src/resources/instances/instances.ts">get</a>(id) -> Instance</code>
- <code title="get /instances/{id}/logs">client.instances.<a href="./src/resources/instances/instances.ts">logs</a>(id, { ...params }) -> string</code>
- <code title="post /instances/{id}/promote-template">client.instances.<a href="./src/resources/instances/instances.ts">promoteTemplate</a>(id) -> Instance</code>
- <code title="post /instances/{id}/restore">client.instances.<a href="./src/resources/instances/instances.ts">restore</a>(id) -> Instance</code>
- <code title="post /instances/{id}/standby">client.instances.<a href="./src/resources/instances/instances.ts">standby</a>(id, { ...params }) -> Instance</code>
- <code title="post /instances/{id}/start">client.instances.<a href="./src/resources/instances/instances.ts">start</a>(id, { ...params }) -> Instance</code>
- <code title="get /instances/{id}/stat">client.instances.<a href="./src/resources/instances/instances.ts">stat</a>(id, { ...params }) -> PathInfo</code>
- <code title="get /instances/{id}/stats">client.instances.<a href="./src/resources/instances/instances.ts">stats</a>(id) -> InstanceStats</code>
- <code title="post /instances/{id}/stop">client.instances.<a href="./src/resources/instances/instances.ts">stop</a>(id) -> Instance</code>
- <code title="get /instances/{id}/wait">client.instances.<a href="./src/resources/instances/instances.ts">wait</a>(id, { ...params }) -> WaitForStateResponse</code>

## AutoStandby

Methods:

- <code title="get /instances/{id}/auto-standby/status">client.instances.autoStandby.<a href="./src/resources/instances/auto-standby.ts">status</a>(id) -> AutoStandbyStatus</code>

## Volumes

Methods:

- <code title="post /instances/{id}/volumes/{volumeId}">client.instances.volumes.<a href="./src/resources/instances/volumes.ts">attach</a>(volumeID, { ...params }) -> Instance</code>
- <code title="delete /instances/{id}/volumes/{volumeId}">client.instances.volumes.<a href="./src/resources/instances/volumes.ts">detach</a>(volumeID, { ...params }) -> Instance</code>

## Snapshots

Methods:

- <code title="post /instances/{id}/snapshots">client.instances.snapshots.<a href="./src/resources/instances/snapshots.ts">create</a>(id, { ...params }) -> Snapshot</code>
- <code title="post /instances/{id}/snapshots/{snapshotId}/restore">client.instances.snapshots.<a href="./src/resources/instances/snapshots.ts">restore</a>(snapshotID, { ...params }) -> Instance</code>

## SnapshotSchedule

Methods:

- <code title="put /instances/{id}/snapshot-schedule">client.instances.snapshotSchedule.<a href="./src/resources/instances/snapshot-schedule.ts">update</a>(id, { ...params }) -> SnapshotSchedule</code>
- <code title="delete /instances/{id}/snapshot-schedule">client.instances.snapshotSchedule.<a href="./src/resources/instances/snapshot-schedule.ts">delete</a>(id) -> void</code>
- <code title="get /instances/{id}/snapshot-schedule">client.instances.snapshotSchedule.<a href="./src/resources/instances/snapshot-schedule.ts">get</a>(id) -> SnapshotSchedule</code>

# Snapshots

Types:

- <code><a href="./src/resources/snapshots.ts">Snapshot</a></code>
- <code><a href="./src/resources/snapshots.ts">SnapshotKind</a></code>
- <code><a href="./src/resources/snapshots.ts">SnapshotListResponse</a></code>

Methods:

- <code title="get /snapshots">client.snapshots.<a href="./src/resources/snapshots.ts">list</a>({ ...params }) -> SnapshotListResponse</code>
- <code title="delete /snapshots/{snapshotId}">client.snapshots.<a href="./src/resources/snapshots.ts">delete</a>(snapshotID) -> void</code>
- <code title="post /snapshots/{snapshotId}/fork">client.snapshots.<a href="./src/resources/snapshots.ts">fork</a>(snapshotID, { ...params }) -> Instance</code>
- <code title="get /snapshots/{snapshotId}">client.snapshots.<a href="./src/resources/snapshots.ts">get</a>(snapshotID) -> Snapshot</code>

# Volumes

Types:

- <code><a href="./src/resources/volumes.ts">Volume</a></code>
- <code><a href="./src/resources/volumes.ts">VolumeAttachment</a></code>
- <code><a href="./src/resources/volumes.ts">VolumeListResponse</a></code>

Methods:

- <code title="post /volumes">client.volumes.<a href="./src/resources/volumes.ts">create</a>({ ...params }) -> Volume</code>
- <code title="get /volumes">client.volumes.<a href="./src/resources/volumes.ts">list</a>({ ...params }) -> VolumeListResponse</code>
- <code title="delete /volumes/{id}">client.volumes.<a href="./src/resources/volumes.ts">delete</a>(id) -> void</code>
- <code title="post /volumes/from-archive">client.volumes.<a href="./src/resources/volumes.ts">createFromArchive</a>(body, { ...params }) -> Volume</code>
- <code title="get /volumes/{id}">client.volumes.<a href="./src/resources/volumes.ts">get</a>(id) -> Volume</code>

# Devices

Types:

- <code><a href="./src/resources/devices.ts">AvailableDevice</a></code>
- <code><a href="./src/resources/devices.ts">Device</a></code>
- <code><a href="./src/resources/devices.ts">DeviceType</a></code>
- <code><a href="./src/resources/devices.ts">DeviceListResponse</a></code>
- <code><a href="./src/resources/devices.ts">DeviceListAvailableResponse</a></code>

Methods:

- <code title="post /devices">client.devices.<a href="./src/resources/devices.ts">create</a>({ ...params }) -> Device</code>
- <code title="get /devices/{id}">client.devices.<a href="./src/resources/devices.ts">retrieve</a>(id) -> Device</code>
- <code title="get /devices">client.devices.<a href="./src/resources/devices.ts">list</a>({ ...params }) -> DeviceListResponse</code>
- <code title="delete /devices/{id}">client.devices.<a href="./src/resources/devices.ts">delete</a>(id) -> void</code>
- <code title="get /devices/available">client.devices.<a href="./src/resources/devices.ts">listAvailable</a>() -> DeviceListAvailableResponse</code>

# Ingresses

Types:

- <code><a href="./src/resources/ingresses.ts">Ingress</a></code>
- <code><a href="./src/resources/ingresses.ts">IngressMatch</a></code>
- <code><a href="./src/resources/ingresses.ts">IngressRule</a></code>
- <code><a href="./src/resources/ingresses.ts">IngressTarget</a></code>
- <code><a href="./src/resources/ingresses.ts">IngressListResponse</a></code>

Methods:

- <code title="post /ingresses">client.ingresses.<a href="./src/resources/ingresses.ts">create</a>({ ...params }) -> Ingress</code>
- <code title="get /ingresses">client.ingresses.<a href="./src/resources/ingresses.ts">list</a>({ ...params }) -> IngressListResponse</code>
- <code title="delete /ingresses/{id}">client.ingresses.<a href="./src/resources/ingresses.ts">delete</a>(id) -> void</code>
- <code title="get /ingresses/{id}">client.ingresses.<a href="./src/resources/ingresses.ts">get</a>(id) -> Ingress</code>

# Resources

Types:

- <code><a href="./src/resources/resources.ts">DiskBreakdown</a></code>
- <code><a href="./src/resources/resources.ts">GPUProfile</a></code>
- <code><a href="./src/resources/resources.ts">GPUResourceStatus</a></code>
- <code><a href="./src/resources/resources.ts">MemoryReclaimAction</a></code>
- <code><a href="./src/resources/resources.ts">MemoryReclaimRequest</a></code>
- <code><a href="./src/resources/resources.ts">MemoryReclaimResponse</a></code>
- <code><a href="./src/resources/resources.ts">PassthroughDevice</a></code>
- <code><a href="./src/resources/resources.ts">ResourceAllocation</a></code>
- <code><a href="./src/resources/resources.ts">ResourceStatus</a></code>
- <code><a href="./src/resources/resources.ts">Resources</a></code>

Methods:

- <code title="get /resources">client.resources.<a href="./src/resources/resources.ts">get</a>() -> Resources</code>
- <code title="post /resources/memory/reclaim">client.resources.<a href="./src/resources/resources.ts">reclaimMemory</a>({ ...params }) -> MemoryReclaimResponse</code>

# Builds

Types:

- <code><a href="./src/resources/builds.ts">Build</a></code>
- <code><a href="./src/resources/builds.ts">BuildEvent</a></code>
- <code><a href="./src/resources/builds.ts">BuildPolicy</a></code>
- <code><a href="./src/resources/builds.ts">BuildProvenance</a></code>
- <code><a href="./src/resources/builds.ts">BuildStatus</a></code>
- <code><a href="./src/resources/builds.ts">BuildListResponse</a></code>

Methods:

- <code title="post /builds">client.builds.<a href="./src/resources/builds.ts">create</a>({ ...params }) -> Build</code>
- <code title="get /builds">client.builds.<a href="./src/resources/builds.ts">list</a>({ ...params }) -> BuildListResponse</code>
- <code title="delete /builds/{id}">client.builds.<a href="./src/resources/builds.ts">cancel</a>(id) -> void</code>
- <code title="get /builds/{id}/events">client.builds.<a href="./src/resources/builds.ts">events</a>(id, { ...params }) -> BuildEvent</code>
- <code title="get /builds/{id}">client.builds.<a href="./src/resources/builds.ts">get</a>(id) -> Build</code>
