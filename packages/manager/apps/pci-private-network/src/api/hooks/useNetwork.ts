import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovhcloud/manager-components';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getAggregatedNetwork, TAggregatedNetwork } from '@/api/data/network';
import { TGateway, TRegion } from '@/api/data/project';
import { getSubnets, TSubnet } from '@/api/data/subnets';
import {
  getLocalZoneRegions,
  isLocalZoneRegion,
  paginateResults,
} from '@/api/utils/utils';

const getDetailSubnets = async (
  projectId: string,
  network: TAggregatedNetwork,
  gatewaySubnetObj: Record<string, string>,
) => {
  const subnetsData: TSubnet[] = await Promise.all(
    network.subnets.map(({ region, networkId }) =>
      getSubnets(projectId, networkId, region),
    ),
  );

  const updatedSubnets = network.subnets.map((subnet, index) => {
    const subnetData = subnetsData[index];

    if (subnetData) {
      return {
        networkId: subnet.networkId,
        region: subnet.region,
        cidr: subnetData.cidr,
        dhcpEnabled: subnetData.dhcpEnabled,
        gatewayIp: subnetData.gatewayIp,
        allocatedIp: subnetData.allocationPools
          .map((ipPool) => `${ipPool.start} - ${ipPool.end}`)
          .join(' ,'),
        gatewayName: gatewaySubnetObj[subnet.networkId],
      };
    }

    return subnet;
  });

  return updatedSubnets;
};

export const filterNonLocalPrivateNetworks = (
  networks: TAggregatedNetwork[],
  regions: TRegion[],
): TAggregatedNetwork[] => {
  const localZones = getLocalZoneRegions(regions);

  const privateNetworks = {};

  const externalNetworks = networks.filter(
    (network) =>
      network.visibility === 'private' &&
      !isLocalZoneRegion(localZones, network.region),
  );

  externalNetworks.forEach((network) => {
    const { id: networkId, region, vlanId, ...rest } = network;

    if (!privateNetworks[vlanId]) {
      privateNetworks[vlanId] = {
        ...rest,
        vlanId,
        region,
        subnets: [{ region, networkId }],
      };
    } else {
      privateNetworks[vlanId].subnets.push({ region, networkId });
    }
  });

  return Object.values(privateNetworks);
};

export const useAggregatedNonLocalNetworks = (
  projectId: string,
  regions: TRegion[],
) =>
  useQuery({
    queryKey: [projectId, 'aggregated', 'network'],
    queryFn: () => getAggregatedNetwork(projectId),
    enabled: regions?.length > 0,
    select: (data) => filterNonLocalPrivateNetworks(data, regions) || [],
  });

export const useGlobalRegionsNetworks = (
  projectId: string,
  networks: TAggregatedNetwork[],
  gateways: TGateway[],
  pagination: PaginationState,
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [projectId, 'private-network', 'global-regions'],
    queryFn: () => {
      const gatewaySubnetObj = gateways.reduce((acc, gatewayItem: TGateway) => {
        gatewayItem.interfaces.forEach(({ networkId }) => {
          acc[networkId] = gatewayItem.name;
        });
        return acc;
      }, {});

      return Promise.all(
        networks.map(async (network) => {
          const detailSubnets = await getDetailSubnets(
            projectId,
            network,
            gatewaySubnetObj,
          );
          return {
            ...network,
            subnets: detailSubnets,
          };
        }),
      );
    },
    enabled: networks.length > 0 && gateways.length > 0,
  });

  return useMemo(() => {
    return {
      isLoading,
      error,
      data: paginateResults(data || [], pagination),
    };
  }, [data, isLoading, error, pagination]);
};

export const filterLocalPrivateNetworks = (
  networks: TAggregatedNetwork[],
  regions: TRegion[],
): TAggregatedNetwork[] => {
  const localZones = getLocalZoneRegions(regions);

  const privateLocalNetworks = networks.filter(
    (network) =>
      network.visibility === 'private' &&
      isLocalZoneRegion(localZones, network.region),
  );

  return privateLocalNetworks;
};

export const useAggregatedLocalNetworks = (
  projectId: string,
  regions: TRegion[],
) =>
  useQuery({
    queryKey: [projectId, 'aggregated', 'local', 'network'],
    queryFn: () => getAggregatedNetwork(projectId),
    enabled: regions?.length > 0,
    select: (data) => filterLocalPrivateNetworks(data, regions) || [],
  });

export type TLocalZoneNetwork = {
  id: string;
  name: string;
  visibility: string;
  vlanId: number;
  allocatedIp?: string;
  cidr: string;
  dhcpEnabled: boolean;
  gatewayIp: string | null;
  gatewayName: string;
  networkId: string;
  region: string;
  search?: string;
};

export const useLocalZoneNetworks = (
  projectId: string,
  networks: TAggregatedNetwork[],
  pagination: PaginationState,
  filters: Filter[] = [],
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [projectId, 'private-network', 'local-zones'],
    queryFn: () => {
      return Promise.all(
        networks.map(async (network) => {
          const detailSubnet = await getSubnets(
            projectId,
            network.id,
            network.region,
          );

          return {
            ...network,
            ...detailSubnet,
            name: network.name,
            allocatedIp: detailSubnet.allocationPools
              .map((ipPool) => `${ipPool.start} - ${ipPool.end}`)
              .join(' ,'),
          } as TLocalZoneNetwork;
        }),
      );
    },
    select: (result) =>
      result.map((network) => ({
        ...network,
        search: `${network.name} ${network.region} ${network.dhcpEnabled} ${network.cidr} ${network.allocatedIp}`,
      })) as TLocalZoneNetwork[],
  });

  return useMemo(() => {
    return {
      isLoading,
      error,
      data: paginateResults(applyFilters(data || [], filters), pagination),
    };
  }, [data, isLoading, error, pagination, filters]);
};
