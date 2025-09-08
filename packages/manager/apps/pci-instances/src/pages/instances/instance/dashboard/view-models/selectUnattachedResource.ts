import { TNetwork } from '@/types/network/entity.type';
import {
  TInstanceAddress,
  TInstanceVolume,
} from '@/types/instance/entity.type';
import { TVolume } from '@/types/volume/common.type';

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

export const selectUnattachedVolumes = (
  volumes: TVolume[],
  instanceVolumes: TInstanceVolume[],
): TUnattachedResource[] =>
  volumes
    .filter(
      ({ id }) =>
        !instanceVolumes.some((instanceVolume) => id === instanceVolume.id),
    )
    .map(({ id, name }) => ({
      label: name,
      value: id,
    }));
