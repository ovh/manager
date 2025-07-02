import { TInstanceDto, TInstanceVolumeDto } from '@/types/instance/api.type';
import {
  TInstanceAddress,
  TInstance,
  TInstanceAddressType,
  TInstanceVolume,
  TInstanceRegion,
  TInstanceTaskStatus,
} from '@/types/instance/entity.type';

const mapRegion = (instance: TInstanceDto): TInstanceRegion => ({
  name: instance.region,
  type: instance.regionType,
  availabilityZone: instance.availabilityZone,
});

const mapTask = ({
  pendingTask,
  taskState,
}: TInstanceDto): TInstanceTaskStatus => ({
  isPending: pendingTask,
  status: taskState || null,
});

const mapVolumes = (volume: TInstanceVolumeDto): TInstanceVolume => ({
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
  }, new Map<TInstanceAddressType, TInstanceAddress[]>());

export const mapInstanceDtoToInstance = (dto: TInstanceDto): TInstance => {
  return {
    ...dto,
    region: mapRegion(dto),
    task: mapTask(dto),
    volumes: dto.volumes.map(mapVolumes),
    backup: dto.backups ?? null,
    image: dto.image ?? null,
    addresses: mapInstanceAddresses(dto),
  };
};
