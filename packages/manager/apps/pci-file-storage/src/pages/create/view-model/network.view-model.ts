import { format } from 'date-fns';

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

export const generateAutoName = (specName: string = 'share'): string => {
  const now = new Date();
  const datePart = format(now, 'dd_MM_yyyy');
  const sanitizedSpecName = specName.replace(/[^a-zA-Z0-9_.-]/g, '_').substring(0, 200);
  return `${sanitizedSpecName}_${datePart}`;
};
