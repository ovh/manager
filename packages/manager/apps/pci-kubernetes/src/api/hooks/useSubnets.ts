import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  getPrivateNetworkSubnets,
  getRegionSubnets,
  TPrivateNetworkSubnet,
} from '@/api/data/subnets';

export const getPrivateNetworkSubnetsQuery = (
  projectId: string,
  privateNetworkId: string,
) => ({
  queryKey: ['project', projectId, 'network', privateNetworkId, 'subnet'],
  queryFn: (): Promise<TPrivateNetworkSubnet[]> =>
    getPrivateNetworkSubnets(projectId, privateNetworkId),
});

export const usePrivateNetworkSubnets = (
  projectId: string,
  privateNetworkId: string,
  regionName: string,
) => {
  const { data, isLoading, error } = useQuery({
    ...getPrivateNetworkSubnetsQuery(projectId, privateNetworkId),
    enabled: !!projectId && !!privateNetworkId,
  });

  const mapSubnets = (subnets: TPrivateNetworkSubnet[] = []) =>
    subnets.map((subnet) => ({
      ...subnet,
      displayedLabel: `${subnet.id} - ${subnet.cidr}`,
    }));

  return useMemo(() => {
    const subnetsByRegion = regionName
      ? data?.filter(({ ipPools }) =>
          ipPools.some((ipPool) => ipPool.region === regionName),
        )
      : data;

    return {
      subnets: mapSubnets(data),
      subnetsByRegion: mapSubnets(subnetsByRegion),
      isLoading,
      error,
    };
  }, [data, isLoading, error]);
};

export const getRegionSubsnetsQueryKey = (
  projectId: string,
  regionName: string,
  networkId: string,
) => ['region-subnets', projectId, 'region', regionName, 'network', networkId];

export const useRegionSubnets = (
  projectId: string,
  regionName: string,
  networkId: string,
) =>
  useQuery({
    queryKey: getRegionSubsnetsQueryKey(projectId, regionName, networkId),
    queryFn: (): Promise<TPrivateNetworkSubnet[]> =>
      getRegionSubnets(projectId, regionName, networkId),
    enabled: !!projectId && !!regionName && !!networkId,
    retry: false,
  });
