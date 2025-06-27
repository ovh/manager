import { TInstanceDetailDto } from '@/types/instance/api.type';
import { TNetwork } from '@/types/network/entity.type';

export const getUnattachedPrivateNetworkByInstance = (
  networks: TNetwork[],
  instance?: TInstanceDetailDto, // TODO: will be the new entity
) =>
  networks.filter(({ visibility, id }) => {
    const attached = instance?.addresses.find(
      (address) =>
        address.type === 'private' && address.subnet.network.id === id,
    );

    return visibility === 'private' && !attached;
  });
