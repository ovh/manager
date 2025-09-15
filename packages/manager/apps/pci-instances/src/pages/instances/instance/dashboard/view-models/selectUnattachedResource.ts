import { TNetwork } from '@/types/network/entity.type';
import {
  TInstanceAddresses,
  TInstanceVolume,
} from '@/types/instance/entity.type';
import { TVolume } from '@/types/volume/common.type';

export type TUnattachedResource = {
  label: string;
  value: string;
};

export const selectUnattachedPrivateNetworks = (
  networks: TNetwork[],
  addresses: TInstanceAddresses,
): TUnattachedResource[] =>
  networks
    .filter(
      ({ id, visibility }) =>
        visibility === 'private' &&
        !addresses
          .get('private')
          ?.find((address) => address.subnet?.network.id === id),
    )
    .map((network) => ({ label: network.name, value: network.id }));

export const selectUnattachedVolumes = (
  volumes: TVolume[],
  instanceVolumes: TInstanceVolume[],
  instanceAvailabilityZone: string | null,
): TUnattachedResource[] =>
  volumes
    .filter(
      ({ id, availabilityZone }) =>
        !instanceVolumes.some((instanceVolume) => id === instanceVolume.id) &&
        (availabilityZone === 'any' ||
          availabilityZone === null ||
          availabilityZone === instanceAvailabilityZone),
    )
    .map(({ id, name }) => ({
      label: name,
      value: id,
    }));
