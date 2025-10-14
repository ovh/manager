import { useMemo, useRef } from 'react';

import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnSort } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

import { Filter, applyFilters } from '@ovh-ux/manager-core-api';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { PaginationState } from '@ovh-ux/manager-react-components';

import {
  TClusterNodePool,
  TUpdateNodePoolSizeParam,
  deleteNodePool,
  getClusterNodePools,
  updateNodePoolSize,
} from '@/api/data/node-pools';
import { useRegionFlavors } from '@/api/hooks/flavors';
import { useKubernetesCluster } from '@/api/hooks/useKubernetes';
import { compareFunction, paginateResults } from '@/helpers';

export const useClusterNodePools = (projectId: string, clusterId: string) => {
  const { i18n } = useTranslation('common');
  const locales = useRef({ ...dateFnsLocales }).current;
  const userLocale = getDateFnsLocale(i18n.language);
  return useQuery({
    queryKey: ['project', projectId, 'kubernetes', clusterId, 'nodePools'],
    queryFn: async () => {
      const pools = await getClusterNodePools(projectId, clusterId);
      return pools.map((pool) => {
        const createdAt = parseISO(pool.createdAt);
        return {
          ...pool,
          createdAt: format(createdAt, 'dd MMM yyyy HH:mm:ss', {
            locale: locales[userLocale],
          }),
        };
      });
    },
    throwOnError: true,
  });
};

export const sortClusterNodePools = (
  pools: TClusterNodePool[],
  sorting: ColumnSort,
): TClusterNodePool[] => {
  const data = [...pools];

  if (sorting) {
    const { id: sortKey, desc } = sorting;

    data.sort(compareFunction<TClusterNodePool>(sortKey as keyof TClusterNodePool));
    if (desc) {
      data.reverse();
    }
  }

  return data;
};

export const usePaginatedClusterNodePools = (
  projectId: string,
  clusterId: string,
  pagination: PaginationState,
  filters: Filter[],
  sorting: ColumnSort,
) => {
  const { t } = useTranslation('detail');
  const {
    data: pools,
    error: poolsError,
    isPending: isPoolsPending,
    isLoading: isPoolsLoading,
  } = useClusterNodePools(projectId, clusterId);

  const {
    data: cluster,
    error: clusterError,
    isPending: isClusterPending,
    isLoading: isClusterLoading,
  } = useKubernetesCluster(projectId, clusterId);

  const {
    data: flavors,
    error: flavorsError,
    isPending: isFlavorsPending,
    isLoading: isFlavorsLoading,
  } = useRegionFlavors(projectId, cluster?.region);

  const poolsWithFlavors = useMemo(
    () =>
      (pools || []).map((pool) => {
        const flavor = (flavors || []).find((f) => f.name === pool.flavor);

        const formattedFlavor = t('kube_flavor', {
          name: flavor?.name?.toUpperCase(),
          cpuNumber: flavor?.vcpus,
          ramCapacity: flavor?.ram / 1000,
          diskCapacity: flavor?.disk,
        });

        return {
          ...pool,
          formattedFlavor,
          location: pool.availabilityZones?.[0] || cluster?.region,
          search: `${pool.name} ${formattedFlavor}`,
        };
      }),
    [pools, flavors, t],
  );

  return {
    data: useMemo(
      () =>
        paginateResults<TClusterNodePool>(
          applyFilters(sortClusterNodePools(poolsWithFlavors || [], sorting), filters),
          pagination,
        ),
      [poolsWithFlavors, pagination, filters, sorting],
    ),
    error: poolsError || clusterError || flavorsError,
    isLoading: isPoolsLoading || isClusterLoading || isFlavorsLoading,
    isPending: isPoolsPending || isClusterPending || isFlavorsPending,
  };
};

type ActionNodePoolProps = {
  projectId: string;
  clusterId: string;
  poolId: string;
  onError: (cause: Error) => void | Promise<void>;
  onSuccess: () => void | Promise<void>;
};

export const useDeleteNodePool = ({
  projectId,
  clusterId,
  poolId,
  onError,
  onSuccess,
}: ActionNodePoolProps) => {
  const mutation = useMutation({
    mutationFn: async () => deleteNodePool(projectId, clusterId, poolId),
    onError: (cause: Error) => {
      onError(cause);
    },
    onSuccess: async () => {
      onSuccess();
    },
  });

  return {
    deletePool: () => mutation.mutate(),
    ...mutation,
  };
};

export const useUpdateNodePoolSize = ({
  projectId,
  clusterId,
  poolId,
  onError,
  onSuccess,
}: ActionNodePoolProps) => {
  const mutation = useMutation({
    mutationFn: async (param: TUpdateNodePoolSizeParam) =>
      updateNodePoolSize(projectId, clusterId, poolId, param),
    onError: (cause: Error) => {
      onError(cause);
    },
    onSuccess: async () => {
      onSuccess();
    },
  });

  return {
    updateSize: (param: TUpdateNodePoolSizeParam) => mutation.mutate(param),
    ...mutation,
  };
};
