import { useMutation, useQuery } from '@tanstack/react-query';
import { PaginationState } from '@ovhcloud/manager-components';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnSort } from '@tanstack/react-table';
import { format, parseISO } from 'date-fns';
import * as dateFnsLocales from 'date-fns/locale';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import {
  deleteNodePool,
  getClusterNodePools,
  TClusterNodePool,
  TUpdateNodePoolSizeParam,
  updateNodePoolSize,
} from '@/api/data/node-pools';
import { useKubernetesCluster } from '@/api/hooks/useKubernetes';
import { useRegionFlavors } from '@/api/hooks/flavors';

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

const paginateResults = <T>(items: T[], pagination: PaginationState) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});

export const defaultCompareFunction = (key: keyof TClusterNodePool) => (
  a: TClusterNodePool,
  b: TClusterNodePool,
) => {
  const aValue = a[key] || '';
  const bValue = b[key] || '';

  return aValue.toString().localeCompare(bValue.toString());
};

export const sortClusterNodePools = (
  pools: TClusterNodePool[],
  sorting: ColumnSort,
): TClusterNodePool[] => {
  const data = [...pools];

  if (sorting) {
    const { id: sortKey, desc } = sorting;

    data.sort(defaultCompareFunction(sortKey as keyof TClusterNodePool));
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
        return {
          ...pool,
          formattedFlavor: t('kube_flavor', {
            name: flavor?.name?.toUpperCase(),
            cpuNumber: flavor?.vcpus,
            ramCapacity: flavor?.ram / 1000,
            diskCapacity: flavor?.disk,
          }),
        };
      }),
    [pools, flavors],
  );

  return {
    data: useMemo(
      () =>
        paginateResults<TClusterNodePool>(
          applyFilters(
            sortClusterNodePools(poolsWithFlavors || [], sorting),
            filters,
          ),
          pagination,
        ),
      [poolsWithFlavors, pagination, filters, sorting],
    ),
    error: poolsError || clusterError || flavorsError,
    isLoading: isPoolsLoading || isClusterLoading || isFlavorsLoading,
    isPending: isPoolsPending || isClusterPending || isFlavorsPending,
  };
};

type RemoveNodePoolProps = {
  projectId: string;
  clusterId: string;
  poolId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeleteNodePool = ({
  projectId,
  clusterId,
  poolId,
  onError,
  onSuccess,
}: RemoveNodePoolProps) => {
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

type UpdateNodePoolSizeProps = RemoveNodePoolProps;

export const useUpdateNodePoolSize = ({
  projectId,
  clusterId,
  poolId,
  onError,
  onSuccess,
}: UpdateNodePoolSizeProps) => {
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
