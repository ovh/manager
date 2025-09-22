import { useQuery } from '@tanstack/react-query';

import {
  TNetworkRegion,
  getAllPrivateNetworks,
  getAllPrivateNetworksByRegion,
} from '../data/network';
import { TGateway, TPrivateNetworkSubnet, getListGateways } from '../data/subnets';

export const getListGatewaysQueryKey = (
  projectId: string,
  regionName: string,
  subnetId: TPrivateNetworkSubnet['id'],
) => ['project', projectId, 'region', regionName, 'gateways', 'subnet', subnetId];

const getQueryKeyPrivateNetworks = (projectId: string) => ['project', projectId, 'privateNetworks'];

export const getQueryKeyPrivateNetworksByRegion = (projectId: string, regionName: string) => [
  ...getQueryKeyPrivateNetworks(projectId),
  'regionName',
  regionName,
];

export const useAllPrivateNetworks = (projectId: string) =>
  useQuery({
    queryKey: getQueryKeyPrivateNetworks(projectId),
    queryFn: () => getAllPrivateNetworks(projectId),
    throwOnError: true,
  });

export const usePrivateNetworkByRegion = (
  projectId: string,
  regionName: string,
  select: (data: TNetworkRegion[]) => TNetworkRegion[],
) =>
  useQuery({
    queryKey: getQueryKeyPrivateNetworksByRegion(projectId, regionName),
    queryFn: () => getAllPrivateNetworksByRegion(projectId, regionName),
    throwOnError: true,
    select,
  });

export const usePrivateNetworkByRegionFilterPublic = (projectId: string, regionName: string) =>
  usePrivateNetworkByRegion(projectId, regionName, (networks) =>
    networks.filter((network) => network.vlanId !== null),
  );

export const useAvailablePrivateNetworks = (projectId: string, regionName: string) =>
  usePrivateNetworkByRegion(projectId, regionName, (networks) =>
    networks
      .filter((network) => network.vlanId !== null)
      .map((network) => ({
        ...network,
        name: `${network.vlanId?.toString().padStart(4, '0')} - ${network.name}`,
        clusterRegion: regionName,
      }))
      .sort((a, b) => a.name.localeCompare(b.name)),
  );

export const useListGateways = (
  projectId: string,
  regionName: string,
  subnetId: string,
  select?: (data: TGateway[]) => TGateway[],
) =>
  useQuery({
    queryKey: getListGatewaysQueryKey(projectId, regionName, subnetId),
    queryFn: () => getListGateways(projectId, regionName, subnetId),
    enabled: !!projectId && !!regionName && !!subnetId,
    select,
  });
