import { useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Filter, applyFilters } from '@ovh-ux/manager-core-api';
import { PaginationState } from '@ovh-ux/manager-react-components';
import {
  checkPrivateNetworkCreationStatus,
  getPrivateNetworks,
  getSubnets,
} from '@/data/api/networks';
import { CreationStatus, TNetwork } from '@/types/network.type';
import queryClient from '@/queryClient';
import { groupedPrivateNetworkByVlanId, paginateResults } from '@/utils/utils';

export const networkQueryKey = (
  projectId: string,
  rest: string[] = [],
): string[] => ['project', projectId, 'network', ...rest];

export const usePrivateNetworks = (projectId: string) =>
  useQuery({
    queryKey: networkQueryKey(projectId),
    queryFn: () => getPrivateNetworks(projectId),
  });

export const usePrivateNetworksRegion = (
  projectId: string,
  pagination: PaginationState,
  filters: Filter[] = [],
) => {
  const queryKey = networkQueryKey(projectId);
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

export const useCheckPrivateNetworkCreationStatus = () =>
  useMutation({
    mutationFn: checkPrivateNetworkCreationStatus,
    retry: (failureCount, error) =>
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
