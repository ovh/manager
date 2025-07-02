import {
  TInstanceDto,
  TInstanceStatusDto,
  TVolumeDto,
} from '@/types/instance/api.type';
import {
  TAddress,
  TInstance,
  TInstanceAddressType,
  TInstanceStatus,
  TInstanceStatusSeverity,
  TVolume,
  TRegion,
  TInstanceState,
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

const mapRegion = (instance: TInstanceDto): TRegion => ({
  name: instance.region,
  type: instance.regionType,
  availabilityZone: instance.availabilityZone,
});

const mapStatus = (instance: TInstanceDto): TInstanceState => ({
  ...getInstanceStatus(instance.status),
  pendingTask: instance.pendingTask,
  taskState: instance.taskState,
});

const mapVolumes = (volume: TVolumeDto): TVolume => ({
  ...volume,
  name: volume.name ?? null,
  size: volume.size ?? null,
});

const mapInstanceAddresses = (instance: TInstanceDto) =>
  instance.addresses.reduce((acc, { type, ...rest }) => {
    const foundAddresses = acc.get(type);
    if (foundAddresses) {
      const ipAlreadyExists = !!foundAddresses.find(({ ip }) => ip === rest.ip);
      if (!ipAlreadyExists)
        foundAddresses.push({ ...rest, subnet: rest.subnet ?? null });
      return acc;
    }
    return acc.set(type, [{ ...rest, subnet: rest.subnet ?? null }]);
  }, new Map<TInstanceAddressType, TAddress[]>());

export const mapInstanceDtoToInstance = (dto: TInstanceDto): TInstance => {
  return {
    ...dto,
    region: mapRegion(dto),
    status: mapStatus(dto),
    volumes: dto.volumes.map(mapVolumes),
    backups: dto.backups ?? null,
    image: dto.image ?? null,
    addresses: mapInstanceAddresses(dto),
  };
};
