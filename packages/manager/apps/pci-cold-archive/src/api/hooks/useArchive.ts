import { useQuery } from '@tanstack/react-query';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { useMemo } from 'react';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { getArchiveContainers, TArchiveContainer } from '../data/archive';
import { paginateResults, sortResults } from '@/helpers';
import queryClient from '@/queryClient';

export const useArchive = (projectId: string, region: string) => {
  return useQuery({
    queryKey: ['projectId', projectId, 'coldArchive'],
    queryFn: () => getArchiveContainers(projectId, region),
    enabled: !!projectId && !!region,
  });
};

export const usePaginatedArchive = (
  projectId: string,
  region: string,
  pagination: PaginationState,
  sorting: ColumnSort,
  filters: Filter[],
) => {
  const {
    data: archives,
    error,
    isLoading,
    isPending,
    isSuccess,
    isFetching,
  } = useArchive(projectId, region);

  return useMemo(
    () => ({
      isLoading,
      isPending,
      isSuccess,
      isFetching,
      paginatedArchives: paginateResults<TArchiveContainer>(
        sortResults<TArchiveContainer>(
          applyFilters<TArchiveContainer>(archives || [], filters),
          sorting,
        ).map((obj, index) => ({
          index,
          ...obj,
        })),
        pagination,
      ),
      refresh: () =>
        queryClient.invalidateQueries({
          queryKey: ['projectId', projectId, 'coldArchive'],
        }),
      allArchives: archives,
      error,
    }),
    [archives, error, isLoading, isPending, pagination, sorting, filters],
  );
};
