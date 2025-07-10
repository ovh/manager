import { TNetwork } from '@/types/network/entity.type';
import { TInstanceAddresses } from '@/types/instance/entity.type';

export type TUnattachedPrivateNetwork = {
  label: string;
  value: string;
};

export const selectUnattachedPrivateNetwork = (
  networks: TNetwork[],
  addresses: TInstanceAddresses,
): TUnattachedPrivateNetwork[] =>
  networks
    .filter(
      ({ id, visibility }) =>
        visibility === 'private' &&
        !addresses
          .get('private')
          ?.find((address) => address.subnet?.network.id === id),
    )
    .map((network) => ({ label: network.name, value: network.id }));
