import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovhcloud/manager-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  deleteNetwork,
  getAggregatedNetwork,
  TAggregatedNetwork,
} from '@/api/data/network';
import { TGateway, TRegion } from '@/api/data/regions';
import { getSubnets, TSubnet } from '@/api/data/subnets';
import {
  getLocalZoneRegions,
  isLocalZoneRegion,
  paginateResults,
} from '@/api/utils/utils';
import queryClient from '@/queryClient';

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

  return network.subnets.map((subnet, index) => {
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

export const useAggregatedNonLocalNetworksRegions = (
  projectId: string,
  customerRegions: TRegion[],
) => {
  const { data } = useAggregatedNonLocalNetworks(projectId, customerRegions);

  return {
    data: useMemo(
      () =>
        Array.from(
          new Set(
            data?.reduce<string[]>(
              (result: string[], network: { subnets: TSubnet[] }) =>
                result.concat(network.subnets.map(({ region }) => region)),
              [],
            ),
          ),
        ),
      [data],
    ),
  };
};

export const useGlobalRegionsNetworks = (
  projectId: string,
  networks: TAggregatedNetwork[],
  gateways: TGateway[],
  pagination: PaginationState,
  filters: Filter[],
) =>
  useQuery({
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
    select: (result) => {
      const mappedData = result.map((network) => ({
        ...network,
        search: `${network.vlanId} ${network.name}`,
      })) as TAggregatedNetwork[];

      return paginateResults(
        applyFilters(mappedData || [], filters),
        pagination,
      );
    },
  });

export const filterLocalPrivateNetworks = (
  networks: TAggregatedNetwork[],
  regions: TRegion[],
): TAggregatedNetwork[] => {
  const localZones = getLocalZoneRegions(regions);

  return networks.filter(
    (network) =>
      network.visibility === 'private' &&
      isLocalZoneRegion(localZones, network.region),
  );
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
  allocatedIp?: string;
  cidr: string;
  dhcpEnabled: boolean;
  gatewayIp: string | null;
  region: string;
  search?: string;
};

const getLocalZoneRegionsQueryKey = (projectId: string) => [
  projectId,
  'private-network',
  'local-zones',
];

export const useLocalZoneNetworks = (
  projectId: string,
  networks: TAggregatedNetwork[],
  pagination: PaginationState,
  filters: Filter[] = [],
) =>
  useQuery({
    queryKey: getLocalZoneRegionsQueryKey(projectId),
    queryFn: () =>
      Promise.all(
        networks.map(async (network) => {
          const detailSubnet = await getSubnets(
            projectId,
            network.id,
            network.region,
          );

          return {
            ...network,
            ...detailSubnet,
            id: network.id,
            name: network.name,
            allocatedIp: detailSubnet.allocationPools
              .map((ipPool) => `${ipPool.start} - ${ipPool.end}`)
              .join(' ,'),
          };
        }),
      ),
    select: (result) => {
      const mappedData = result.map((network) => ({
        ...network,
        search: `${network.name} ${network.region} ${network.dhcpEnabled} ${network.cidr} ${network.allocatedIp}`,
      }));

      return paginateResults(
        applyFilters(mappedData || [], filters),
        pagination,
      );
    },
  });

type TDeleteNetwork = {
  projectId: string;
  region: string;
  networkId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeleteNetwork = ({
  projectId,
  region,
  networkId,
  onError,
  onSuccess,
}: TDeleteNetwork) => {
  const mutation = useMutation({
    mutationFn: () => deleteNetwork(projectId, region, networkId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getLocalZoneRegionsQueryKey(projectId),
      });
      return onSuccess();
    },
  });

  return {
    deleteNetwork: mutation.mutate,
    ...mutation,
  };
};
