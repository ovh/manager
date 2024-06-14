import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovhcloud/manager-components';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
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

export const useAggregatedNetwork = (projectId: string) =>
  useQuery({
    queryKey: ['aggregated-network', projectId],
    queryFn: () => getAggregatedNetwork(projectId),
  });

export const useAggregatedNonLocalNetworks = (
  projectId: string,
  regions: TRegion[],
) => {
  const localZones = getLocalZoneRegions(regions);
  const query = useAggregatedNetwork(projectId);
  const data = useMemo(() => {
    if (query.isPending) return undefined;
    return query.data
      .filter((network) => network.visibility === 'private')
      .filter((network) => !isLocalZoneRegion(localZones, network.region))
      .filter((network) => network.vlanId)
      .reduce((acc, network) => {
        const n = acc.find((i) => i.vlanId === network.vlanId);
        if (n) {
          n.subnets.push({
            region: network.region,
            networkId: network.id,
          });
        } else {
          acc.push({
            ...network,
            subnets: [
              {
                region: network.region,
                networkId: network.id,
              },
            ],
          });
        }
        return acc;
      }, [])
      .sort((a, b) => a.vlanId - b.vlanId);
  }, [query.data, localZones]);
  return {
    ...query,
    data,
  };
};

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
) => {
  const networkSubnets = networks.reduce(
    (acc, n) =>
      acc.concat(
        n.subnets.map((sub) => ({
          network: n,
          subnet: sub,
        })),
      ),
    [],
  );
  const subnetQueries = useQueries({
    queries: networkSubnets?.map(({ network, subnet }) => ({
      queryKey: ['subnet', projectId, subnet.networkId, subnet.region],
      queryFn: () => getSubnets(projectId, subnet.networkId, subnet.region),
      select: (subnetDetails: TSubnet) => ({
        network,
        subnet: {
          ...subnet,
          ...subnetDetails,
          region: subnet.region,
          allocatedIp: subnetDetails.allocationPools
            ?.map((i) => `${i.start} - ${i.end}`)
            .join(' ,'),
          gatewayName: gateways.find((g) =>
            g.interfaces.find((i) => i.networkId === subnet.networkId),
          )?.name,
        },
      }),
    })),
  });

  const isPending = subnetQueries.some((q) => q.isPending);
  const isFetching = subnetQueries.some((q) => q.isFetching);
  const data = useMemo(() => {
    if (isFetching || isPending) return undefined;
    return paginateResults(
      applyFilters(
        networks?.map((n) => ({
          ...n,
          search: `${n.name} ${n.vlanId} ${n.region}`,
          subnets: subnetQueries
            .map((q) => q.data)
            .filter((i) => i)
            .filter(({ network }) => network.id === n.id)
            .map(({ subnet }) => subnet),
        })),
        filters,
      ),
      pagination,
    );
  }, [isFetching, isPending, networks, pagination, filters]);

  return {
    isPending,
    isFetching,
    data,
    error: subnetQueries.map((q) => q.error).some((e) => e),
  };
};

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
) => {
  const query = useAggregatedNetwork(projectId);
  return {
    ...query,
    data: query.isPending
      ? undefined
      : filterLocalPrivateNetworks(query.data, regions),
  };
};

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

export const useLocalZoneNetworks = (
  projectId: string,
  networks: TAggregatedNetwork[],
  pagination: PaginationState,
  filters: Filter[] = [],
) => {
  const subnetQueries = useQueries({
    queries: networks?.map((n) => ({
      queryKey: ['subnet', projectId, n.id, n.region],
      queryFn: () => getSubnets(projectId, n.id, n.region),
      select: (subnet: TSubnet) => {
        const network = networks.find((net) => net.id === n.id);
        const ips = subnet.allocationPools
          ?.map((ipPool) => `${ipPool.start} - ${ipPool.end}`)
          .join(' ,');
        return {
          ...subnet,
          ...network,
          allocatedIp: ips,
          search: `${network.id} ${network.name} ${network.region} ${subnet.cidr} ${subnet.gatewayIp} ${ips}`,
        };
      },
    })),
  });
  const isPending = subnetQueries.some((q) => q.isPending);
  const isFetching = subnetQueries.some((q) => q.isFetching);
  const data = useMemo(() => {
    if (isFetching || isPending) return undefined;
    return paginateResults(
      applyFilters(
        subnetQueries.map((q) => q.data).filter((i) => i),
        filters,
      ),
      pagination,
    );
  }, [isFetching, isPending, subnetQueries, pagination, filters]);
  return {
    isPending,
    isFetching,
    data,
    error: subnetQueries.map((q) => q.error).some((e) => e),
  };
};

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
        queryKey: ['aggregated-network', projectId],
      });
      return onSuccess();
    },
  });

  return {
    deleteNetwork: mutation.mutate,
    ...mutation,
  };
};
