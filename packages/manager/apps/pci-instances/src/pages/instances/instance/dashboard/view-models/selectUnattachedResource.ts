import { TNetwork } from '@/types/network/entity.type';
import { TInstanceAddress } from '@/types/instance/entity.type';
import { TVolume } from '@/types/volume/entity.type';
import { VOLUME_MULTI_ATTACH_MAX } from './selectUnattachedResource.constant';
import { TInstanceDashboardViewModel } from './selectInstanceDashboard';

export type TUnattachedResource = {
  label: string;
  value: string;
};

export const selectUnattachedPrivateNetworks = (
  networks: TNetwork[],
  addresses: TInstanceAddress[],
): TUnattachedResource[] =>
  networks
    .filter(
      ({ id, visibility }) =>
        visibility === 'private' &&
        !addresses.find((address) => address.subnet?.network.id === id),
    )
    .map((network) => ({ label: network.name, value: network.id }));

export type TUnattachedVolume = TUnattachedResource & {
  canBeDetached: boolean;
};

export const selectUnattachedVolumes = (
  volumes: TVolume[],
  instance: NonNullable<TInstanceDashboardViewModel>,
): TUnattachedVolume[] =>
  volumes
    .filter(
      ({ availabilityZone, attachedInstances }) =>
        !attachedInstances.includes(instance.id) &&
        (availabilityZone === 'any' ||
          availabilityZone === instance.region.availabilityZone ||
          availabilityZone === null),
    )
    .map(({ id, name, attachedInstances, status }) => {
      const isMultiAttach =
        instance.region.type === 'region-3-az' &&
        attachedInstances.length < VOLUME_MULTI_ATTACH_MAX;

      return {
        label: name,
        value: id,
        canBeDetached: !isMultiAttach && status === 'in-use',
      };
    });
