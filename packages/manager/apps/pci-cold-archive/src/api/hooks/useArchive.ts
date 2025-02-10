import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { useContext, useMemo } from 'react';
import { ApiError, applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { useProductRegionsAvailability } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  addUserToContainer,
  createArchiveContainer,
  deleteArchiveContainer,
  flushArchive,
  getArchiveContainers,
  restoreArchiveContainer,
  startArchiveContainer,
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

export const useArchives = (projectId: string) => {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const { data: regions } = useProductRegionsAvailability(
    ovhSubsidiary,
    'coldarchive.archive.hour.consumption',
  );

  const region = regions?.[0];

  return useQuery({
    queryKey: getQueryKeyArchive(projectId, region),
    queryFn: () => getArchiveContainers(projectId, region),
    enabled: !!projectId && !!region,
  });
};

export const useGetArchiveByName = (projectId: string, archiveName: string) => {
  const { data, isPending } = useArchives(projectId);

  return useMemo(() => data?.find((a) => a.name === archiveName), [
    data,
    isPending,
  ]);
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
  } = useArchives(projectId);

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

  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeleteArchiveContainer = ({
  projectId,
  onError,
  onSuccess,
}: Readonly<DeleteArchiveProps>) => {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const { data: regions } = useProductRegionsAvailability(
    ovhSubsidiary,
    'coldarchive.archive.hour.consumption',
  );

  const region = regions?.[0];

  const mutation = useMutation({
    mutationFn: (containerName: string) =>
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
    deleteArchiveContainer: (containerName: string) =>
      mutation.mutate(containerName),
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

type StartArchiveContainerProps = {
  projectId: string;
  containerName: string;
  region: string;
  lockedUntilDays?: number;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useStartArchiveContainer = ({
  projectId,
  containerName,
  region,
  lockedUntilDays,
  onError,
  onSuccess,
}: Readonly<StartArchiveContainerProps>) => {
  const mutation = useMutation({
    mutationFn: () =>
      startArchiveContainer({
        projectId,
        region,
        archiveName: containerName,
        lockedUntilDays,
      }),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getQueryKeyArchive(projectId, region),
      });
      onSuccess();
    },
  });
  return {
    startArchiveContainer: () => mutation.mutate(),
    ...mutation,
  };
};

type FlushArchiveProps = {
  projectId: string;
  containerName: string;
  region: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useFlushArchive = ({
  projectId,
  containerName,
  region,
  onError,
  onSuccess,
}: Readonly<FlushArchiveProps>) => {
  const mutation = useMutation({
    mutationFn: () =>
      flushArchive({
        projectId,
        region,
        archiveName: containerName,
      }),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getQueryKeyArchive(projectId, region),
      });
      onSuccess();
    },
  });

  return {
    flushArchive: () => mutation.mutate(),
    ...mutation,
  };
};

export interface UseCreateContainerArgs {
  name: string;
  ownerId: number;
}

export const useCreateContainer = ({
  projectId,
  region,
  onSuccess,
  onError,
}: {
  projectId: string;
  region: string;
  onSuccess: (container: TArchiveContainer) => void;
  onError: (error: ApiError) => void;
}) => {
  const mutation = useMutation({
    mutationFn: (container: UseCreateContainerArgs) =>
      createArchiveContainer({ projectId, region, ...container }),
    onError,
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: getQueryKeyArchive(projectId, region),
      });
      onSuccess(result);
    },
  });

  return {
    createContainer: (container: UseCreateContainerArgs) =>
      mutation.mutate(container),
    ...mutation,
  };
};
