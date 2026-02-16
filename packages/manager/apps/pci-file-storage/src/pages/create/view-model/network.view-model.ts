import { format } from 'date-fns';

import { TNetwork, TSubnet } from '@/domain/entities/network.entity';
import { getPrivateNetworks } from '@/domain/services/network.service';

export type TPrivateNetworkData = {
  label: string;
  value: string;
};

export type TSubnetData = {
  label: string;
  value: string;
};

const mapNetworkToPrivateNetworkData = (network: TNetwork): TPrivateNetworkData => ({
  label: network.name || (network.vlanId?.toString() ?? network.id.slice(0, 13)),
  value: network.id,
});

const mapSubnetToSubnetData = (subnet: TSubnet): TSubnetData => ({
  label: subnet.name,
  value: subnet.id,
});

export const selectPrivateNetworksForRegion =
  (region: string | undefined) =>
  (networks: TNetwork[] | undefined): TPrivateNetworkData[] => {
    if (!networks || !region) return [];
    return getPrivateNetworks(networks).map(mapNetworkToPrivateNetworkData);
  };

export const selectSubnetsForNetwork =
  (networkId: string | undefined) =>
  (subnets: TSubnet[] | undefined): TSubnetData[] => {
    if (!subnets || !networkId) return [];
    return subnets.map(mapSubnetToSubnetData);
  };

export const generateAutoName = (specName: string = 'share'): string => {
  const now = new Date();
  const datePart = format(now, 'yyyy_MM_dd');
  const sanitizedSpecName = specName.replace(/[^a-zA-Z0-9_.-]/g, '_').substring(0, 200);
  return `${sanitizedSpecName}_${datePart}`;
};
