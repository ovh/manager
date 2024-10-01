import { ApiError, applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import queryClient from '@/queryClient';
import { paginateResults, sortResults } from '@/helpers';

import {
  createPool,
  deletePool,
  getLoadBalancerPools,
  TLoadBalancerPool,
} from '@/api/data/pool';

export const useAllLoadBalancerPools = ({
  projectId,
  region,
  loadBalancerId,
}: {
  projectId: string;
  region: string;
  loadBalancerId: string;
}) =>
  useQuery({
    queryKey: ['pools', projectId, region, loadBalancerId],
    queryFn: () => getLoadBalancerPools(projectId, region, loadBalancerId),
    enabled: !!region && !!loadBalancerId,
    select: (data) =>
      data.map((pool) => ({
        ...pool,
        search: `${pool.name} ${pool.algorithm} ${pool.protocol}`,
      })),
    throwOnError: true,
  });

export const useLoadBalancerPools = (
  projectId: string,
  region: string,
  loadBalancerId: string,
  pagination: PaginationState,
  sorting: ColumnSort,
  filters: Filter[],
) => {
  const {
    data: loadBalancerPools,
    error,
    isLoading,
    isPending,
  } = useAllLoadBalancerPools({ projectId, region, loadBalancerId });

  return useMemo(
    () => ({
      isLoading,
      isPending,
      data: paginateResults<TLoadBalancerPool>(
        sortResults<TLoadBalancerPool>(
          applyFilters(loadBalancerPools || [], filters),
          sorting,
        ),
        pagination,
      ),
      error,
    }),
    [
      loadBalancerPools,
      error,
      isLoading,
      isPending,
      pagination,
      sorting,
      filters,
    ],
  );
};

type DeletePoolProps = {
  projectId: string;
  region: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeletePool = ({
  projectId,
  region,
  onError,
  onSuccess,
}: DeletePoolProps) => {
  const mutation = useMutation({
    mutationFn: async (poolId: string) => deletePool(projectId, region, poolId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['pools', projectId, region],
      });
      onSuccess();
    },
  });
  return {
    deletePool: (poolId: string) => mutation.mutate(poolId),
    ...mutation,
  };
};

export type TCreatePool = {
  projectId: string;
  region: string;
  loadbalancerId: string;
  name: string;
  algorithm: string;
  protocol: string;
  sessionPersistenceType?: string;
  cookieName?: string;
  onError: (cause: ApiError) => void;
  onSuccess: () => void;
};

export const useCreatePool = ({
  projectId,
  region,
  loadbalancerId,
  name,
  algorithm,
  protocol,
  sessionPersistenceType,
  cookieName = '',
  onError,
  onSuccess,
}: TCreatePool) => {
  const mutation = useMutation({
    mutationFn: async () =>
      createPool({
        projectId,
        region,
        loadbalancerId,
        name,
        algorithm,
        protocol,
        sessionPersistenceType,
        cookieName,
      }),
    onError: (cause: ApiError) => {
      onError(cause);
    },
    onSuccess: async () => {
      onSuccess();
    },
  });

  return {
    createPool: () => mutation.mutate(),
    ...mutation,
  };
};
