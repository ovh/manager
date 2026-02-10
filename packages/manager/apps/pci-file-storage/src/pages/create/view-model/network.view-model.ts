import { format } from 'date-fns';

import { TNetwork } from '@/domain/entities/network.entity';
import { getPrivateNetworks } from '@/domain/services/network.service';

export type TPrivateNetworkData = {
  label: string;
  value: string;
};

const mapNetworkToPrivateNetworkData = (network: TNetwork): TPrivateNetworkData => ({
  label: network.name,
  value: network.id,
});

export const selectPrivateNetworksForRegion =
  (region: string | undefined) =>
  (networks: TNetwork[] | undefined): TPrivateNetworkData[] => {
    if (!networks || !region) return [];
    return getPrivateNetworks(networks).map(mapNetworkToPrivateNetworkData);
  };

export const generateAutoName = (specName: string = 'share'): string => {
  const now = new Date();
  const datePart = format(now, 'yyyy_MM_dd');
  const sanitizedSpecName = specName.replace(/[^a-zA-Z0-9_.-]/g, '_').substring(0, 200);
  return `${sanitizedSpecName}_${datePart}`;
};
