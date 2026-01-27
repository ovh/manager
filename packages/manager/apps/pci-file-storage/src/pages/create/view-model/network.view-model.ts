import { TPrivateNetworkData } from '@/adapters/network/left/network.data';
import { mapNetworkToPrivateNetworkData } from '@/adapters/network/left/network.mapper';
import { TNetwork } from '@/domain/entities/network.entity';
import { getPrivateNetworks } from '@/domain/services/network.service';

export const selectPrivateNetworksForRegion =
  (region: string | undefined) =>
  (networks: TNetwork[] | undefined): TPrivateNetworkData[] => {
    if (!networks || !region) return [];
    return getPrivateNetworks(networks).map(mapNetworkToPrivateNetworkData);
  };
