import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { useMemo } from 'react';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import {
  deleteArchiveContainer,
  getArchiveContainers,
  TArchiveContainer,
} from '../data/archive';
import { paginateResults, sortResults } from '@/helpers';
import queryClient from '@/queryClient';

const getQueryKeyArchive = (projectId: string) => [
  'projectId',
  projectId,
  'coldArchive',
];

export const useArchive = (projectId: string, region: string) => {
  return useQuery({
    queryKey: getQueryKeyArchive(projectId),
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
          queryKey: getQueryKeyArchive(projectId),
        }),
      allArchives: archives,
      error,
    }),
    [archives, error, isLoading, isPending, pagination, sorting, filters],
  );
};

type DeleteArchiveProps = {
  projectId: string;
  containerName: string;
  region: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeleteArchiveContainer = ({
  projectId,
  containerName,
  region,
  onError,
  onSuccess,
}: DeleteArchiveProps) => {
  const mutation = useMutation({
    mutationFn: async () =>
      deleteArchiveContainer({ projectId, region, containerName }),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getQueryKeyArchive(projectId),
      });
      onSuccess();
    },
  });
  return {
    deleteArchiveContainer: () => mutation.mutate(),
    ...mutation,
  };
};
