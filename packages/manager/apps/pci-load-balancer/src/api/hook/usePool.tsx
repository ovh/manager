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
  getPool,
  TLoadBalancerPool,
  TUpdatePoolParam,
  updatePool,
} from '@/api/data/pool';

export type TUsePoolParam = {
  projectId: string;
  region: string;
  onError: (cause: ApiError) => void;
  onSuccess: (pool: TLoadBalancerPool) => void;
};

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

export const useGetPool = ({
  projectId,
  region,
  poolId,
}: {
  projectId: string;
  region: string;
  poolId: string;
}) =>
  useQuery({
    queryKey: ['pool', projectId, region, poolId],
    queryFn: () => getPool(projectId, region, poolId),
    enabled: !!projectId && !!region && !!poolId,
    throwOnError: true,
  });

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

export const useCreatePool = ({
  projectId,
  region,
  loadbalancerId,
  onError,
  onSuccess,
}: TUsePoolParam & { loadbalancerId: string }) => {
  const mutation = useMutation({
    mutationFn: async ({
      name,
      algorithm,
      protocol,
      permanentSession,
    }: {
      name: string;
      algorithm: string;
      protocol: string;
      permanentSession: {
        isEnabled: boolean;
        type?: string;
        cookieName?: string;
      };
    }) =>
      createPool({
        projectId,
        region,
        loadbalancerId,
        name,
        algorithm,
        protocol,
        permanentSession,
      }),
    onError: (cause: ApiError) => {
      onError(cause);
    },
    onSuccess: async (pool: TLoadBalancerPool) => {
      onSuccess(pool);
      await queryClient.invalidateQueries({
        queryKey: ['pools', projectId, region],
      });
    },
  });

  return {
    doCreatePool: mutation.mutate,
    ...mutation,
  };
};

export const useUpdatePool = ({
  projectId,
  region,
  poolId,
  onError,
  onSuccess,
}: TUsePoolParam & { poolId: string }) => {
  const mutation = useMutation({
    mutationFn: async ({
      name,
      algorithm,
      permanentSession,
    }: Pick<TUpdatePoolParam, 'name' | 'algorithm' | 'permanentSession'>) =>
      updatePool({
        projectId,
        region,
        poolId,
        name,
        algorithm,
        permanentSession,
      }),
    onError: (cause: ApiError) => {
      onError(cause);
    },
    onSuccess: async (pool: TLoadBalancerPool) => {
      onSuccess(pool);
      await queryClient.invalidateQueries({
        queryKey: ['pools', projectId, region],
      });
    },
  });

  return {
    doUpdatePool: mutation.mutate,
    ...mutation,
  };
};
