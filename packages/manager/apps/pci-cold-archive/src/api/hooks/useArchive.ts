import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { useMemo } from 'react';
import { applyFilters, Filter } from '@ovh-ux/manager-core-api';
import {
  addUserToContainer,
  deleteArchiveContainer,
  getArchiveContainers,
  restoreArchiveContainer,
  TArchiveContainer,
} from '../data/archive';
import { paginateResults, sortResults } from '@/helpers';
import queryClient from '@/queryClient';

const getQueryKeyArchive = (projectId: string, region: string) => [
  'projectId',
  projectId,
  'region',
  region,
  'coldArchive',
];

export const useArchives = (projectId: string, region?: string) => {
  return useQuery({
    queryKey: getQueryKeyArchive(projectId, region),
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
  } = useArchives(projectId, region);

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
          queryKey: getQueryKeyArchive(projectId, region),
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
}: Readonly<DeleteArchiveProps>) => {
  const mutation = useMutation({
    mutationFn: () =>
      deleteArchiveContainer({ projectId, region, containerName }),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getQueryKeyArchive(projectId, region),
      });
      onSuccess();
    },
  });
  return {
    deleteArchiveContainer: () => mutation.mutate(),
    ...mutation,
  };
};

type RestoreArchiveProps = {
  projectId: string;
  containerName: string;
  region: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useRestoreArchiveContainer = ({
  projectId,
  containerName,
  region,
  onError,
  onSuccess,
}: Readonly<RestoreArchiveProps>) => {
  const mutation = useMutation({
    mutationFn: () =>
      restoreArchiveContainer({ projectId, region, containerName }),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getQueryKeyArchive(projectId, region),
      });
      onSuccess();
    },
  });
  return {
    restoreArchiveContainer: () => mutation.mutate(),
    ...mutation,
  };
};

type AddUserProps = {
  projectId: string;
  storageId: string;
  region: string;
  userId: number;
  role: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useAddUser = ({
  projectId,
  storageId,
  region,
  userId,
  role,
  onError,
  onSuccess,
}: AddUserProps) => {
  const mutation = useMutation({
    mutationFn: () =>
      addUserToContainer({ projectId, region, storageId, userId, role }),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getQueryKeyArchive(projectId, region),
      });
      onSuccess();
    },
  });

  return {
    addUser: () => mutation.mutate(),
    ...mutation,
  };
};
