import { useMemo } from 'react';
import { useQuery, useQueries, useMutation } from '@tanstack/react-query';
import { Filter, applyFilters } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovh-ux/manager-react-components';
import {
  checkPrivateNetworkCreationStatus,
  getPrivateNetworks,
  getSubnets,
  deleteNetwork as apiDeleteNetwork,
} from '@/data/api/networks';
import {
  CreationStatus,
  TGroupedSubnet,
  TNetwork,
  TSubnet,
} from '@/types/network.type';
import queryClient from '@/queryClient';
import { groupedPrivateNetworkByVlanId, paginateResults } from '@/utils/utils';

const networksQueryKey = (projectId: string, rest: string[] = []): string[] => [
  'project',
  projectId,
  'network',
  ...rest,
];

export const usePrivateNetworks = (projectId: string) =>
  useQuery({
    queryKey: networksQueryKey(projectId),
    queryFn: () => getPrivateNetworks(projectId),
  });

export const useRegionPrivateNetworks = (
  projectId: string,
  pagination: PaginationState,
  filters: Filter[] = [],
) => {
  const queryKey = networksQueryKey(projectId);
  const data = queryClient.getQueryData<TNetwork[]>(queryKey) || [];

  return useMemo(
    () =>
      paginateResults(
        applyFilters(groupedPrivateNetworkByVlanId(data), filters),
        pagination,
      ),
    [data, filters, pagination],
  );
};

const getFormattedSubnets = (
  networkId: string,
  name: string,
  region: string,
  subnets: TSubnet[],
): TGroupedSubnet[] =>
  subnets.map(
    ({
      allocationPools,
      id: subId,
      cidr,
      gatewayIp,
      dhcpEnabled,
      ipVersion,
    }) => {
      const allocatedIp = allocationPools
        ?.map(
          (allocationPool) => `${allocationPool.start} - ${allocationPool.end}`,
        )
        .join(' ,');

      return {
        id: subId,
        networkId,
        name,
        region,
        cidr,
        gatewayIp,
        dhcpEnabled,
        ipVersion,
        allocatedIp,
        search: `${name} ${region} ${ipVersion} ${cidr} ${region} ${allocatedIp}`,
      };
    },
  );

export const useLZPrivateNetworks = (projectId: string) => {
  const queryKey = networksQueryKey(projectId);
  const data = queryClient.getQueryData<TNetwork[]>(queryKey) || [];
  const networks = data.filter((network) => !network.vlanId);

  return useQueries({
    queries: networks.map(({ id, region, name }) => ({
      queryKey: networksQueryKey(projectId, ['subnets', region, id]),
      queryFn: () => getSubnets(projectId, region, id),
      select: (subnets: TSubnet[]) =>
        getFormattedSubnets(id, name, region, subnets),
    })),
    combine: (results) => ({
      data: results.map((result, index) => {
        const { id: networkId, region, name } = networks[index];

        return {
          ...result.data?.[0],
          networkId,
          region,
          name,
          isPending: result.isPending,
        };
      }),
    }),
  });
};

const getNetworkCompletedStatus = async (
  projectId: string,
  operationId: string,
) => {
  const data = await checkPrivateNetworkCreationStatus({
    projectId,
    operationId,
  });

  if (data.status !== 'completed') {
    throw new Error(data.status);
  }

  return data;
};

export const fetchCheckPrivateNetworkCreationStatus = (
  projectId: string,
  operationId: string,
) =>
  queryClient.fetchQuery({
    queryKey: [],
    queryFn: () => getNetworkCompletedStatus(projectId, operationId),
    retry: (_failureCount, error) =>
      ![CreationStatus.completed, CreationStatus.inError].includes(
        error.message as CreationStatus,
      ),
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

export const useSubnets = (
  projectId: string,
  networkId: string,
  region: string,
) =>
  useQuery({
    queryKey: ['subnets', projectId, networkId, region],
    queryFn: () => getSubnets(projectId, region, networkId),
    enabled: !!(projectId && networkId && region),
  });

export const updatePrivateNetworksList = async (
  projectId: string,
  newNetwork: TNetwork,
) => {
  const queryKey = networksQueryKey(projectId);
  const networks = queryClient.getQueryData<TNetwork[]>(queryKey);

  if (networks) {
    queryClient.setQueryData(queryKey, [newNetwork, ...networks]);
  }
};

type DeletePrivateNetworkProps = {
  projectId: string;
  region: string;
  networkId: string;
  onError: (error: Error) => void;
  onSuccess: () => void;
};

export const useDeletePrivateNetwork = ({
  projectId,
  region,
  networkId,
  onError,
  onSuccess,
}: DeletePrivateNetworkProps) =>
  useMutation({
    mutationFn: () => apiDeleteNetwork(projectId, region, networkId),
    onError,
    onSuccess: async () => {
      const queryKey = networksQueryKey(projectId);
      queryClient.setQueryData(queryKey, (networks: TNetwork[]) =>
        networks.filter((network) => network.id !== networkId),
      );
      onSuccess();
    },
  });
