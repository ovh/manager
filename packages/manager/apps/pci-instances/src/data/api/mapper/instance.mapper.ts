import {
  TInstanceDto2,
  TInstanceStatusDto,
  TVolumeDto,
} from '@/types/instance/api.type';
import {
  TAddress2,
  TInstance,
  TInstanceAddressType,
  TInstanceStatus,
  TInstanceStatusSeverity,
  TVolume2,
} from '@/types/instance/entity.type';

const getInstanceStatusSeverity = (
  status: TInstanceStatusDto,
): TInstanceStatusSeverity => {
  switch (status) {
    case 'BUILDING':
    case 'REBOOT':
    case 'REBUILD':
    case 'REVERT_RESIZE':
    case 'SOFT_DELETED':
    case 'VERIFY_RESIZE':
    case 'MIGRATING':
    case 'RESIZE':
    case 'BUILD':
    case 'SHUTOFF':
    case 'RESCUE':
    case 'SHELVED':
    case 'SHELVED_OFFLOADED':
    case 'RESCUING':
    case 'UNRESCUING':
    case 'SNAPSHOTTING':
    case 'RESUMING':
    case 'HARD_REBOOT':
    case 'PASSWORD':
    case 'PAUSED':
      return 'warning';
    case 'DELETED':
    case 'ERROR':
    case 'STOPPED':
    case 'SUSPENDED':
    case 'UNKNOWN':
      return 'error';
    case 'ACTIVE':
    case 'RESCUED':
    case 'RESIZED':
      return 'success';
    default:
      return 'info';
  }
};

const getInstanceStatus = (status: TInstanceStatusDto): TInstanceStatus => ({
  label: status,
  severity: getInstanceStatusSeverity(status),
});

const mapRegion = (instance: TInstanceDto2): TInstance['region'] => ({
  name: instance.region,
  type: instance.regionType,
  availabilityZone: instance.availabilityZone,
});

const mapState = (instance: TInstanceDto2): TInstance['state'] => ({
  status: getInstanceStatus(instance.status),
  pendingTask: instance.pendingTask,
  taskState: instance.taskState,
});

const mapVolumes = (volume: TVolumeDto): TVolume2 => ({
  ...volume,
  name: volume.name ?? null,
  size: volume.size ?? null,
});

const mapInstanceAddresses = (instance: TInstanceDto2) =>
  instance.addresses.reduce((acc, { type, ...rest }) => {
    const foundAddresses = acc.get(type);
    if (foundAddresses) {
      const ipAlreadyExists = !!foundAddresses.find(({ ip }) => ip === rest.ip);
      if (!ipAlreadyExists)
        foundAddresses.push({ ...rest, subnet: rest.subnet ?? null });
      return acc;
    }
    return acc.set(type, [{ ...rest, subnet: rest.subnet ?? null }]);
  }, new Map<TInstanceAddressType, TAddress2[]>());

export const mapInstanceDtoToInstance = (dto: TInstanceDto2): TInstance => {
  return {
    ...dto,
    region: mapRegion(dto),
    state: mapState(dto),
    volumes: dto.volumes.map(mapVolumes),
    backups: dto.backups ?? null,
    image: dto.image ?? null,
    addresses: mapInstanceAddresses(dto),
  };
};
