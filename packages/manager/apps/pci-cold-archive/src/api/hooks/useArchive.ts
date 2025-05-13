import { useMutation, useQuery } from '@tanstack/react-query';
import { ColumnSort, PaginationState } from '@ovh-ux/manager-react-components';
import { useContext, useMemo } from 'react';
import { ApiError, applyFilters, Filter } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  addUserToContainer,
  createArchiveContainer,
  deleteArchive,
  flushArchive,
  getArchiveContainers,
  restoreArchive,
  startArchive,
  TArchiveContainer,
} from '@/api/data/archive';
import { paginateResults, sortResults } from '@/helpers';
import queryClient from '@/queryClient';
import { useProductRegionsAvailability } from './useRegions';

type TBaseProps = Readonly<{
  projectId: string;
  onSuccess: () => void;
  onError: (cause: ApiError) => void;
}>;

const getArchivesCacheKey = (projectId: string, region: string) => [
  projectId,
  region,
  'allArchives',
];

export const invalidateGetArchivesCache = (
  projectId: string,
  region: string,
) => {
  queryClient.invalidateQueries({
    queryKey: getArchivesCacheKey(projectId, region),
  });
};

export const useArchiveRegion = () => {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const { data: regions } = useProductRegionsAvailability(
    ovhSubsidiary,
    'coldarchive.archive.hour.consumption',
  );

  return regions?.[0];
};

export const useArchives = (projectId: string) => {
  const region = useArchiveRegion();

  return useQuery({
    queryKey: getArchivesCacheKey(projectId, region),
    queryFn: () => getArchiveContainers(projectId, region),
    enabled: !!projectId && !!region,
  });
};

export const useGetArchiveByName = (projectId: string, archiveName: string) => {
  const { data } = useArchives(projectId);

  return useMemo(() => data?.find((a) => a.name === archiveName), [data]);
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

  return useMemo(() => {
    const sortedAndFilteredArchives = sortResults<TArchiveContainer>(
      applyFilters<TArchiveContainer>(archives || [], filters),
      sorting,
    );
    return {
      isLoading,
      isPending,
      isSuccess,
      isFetching,
      paginatedArchives: paginateResults<TArchiveContainer>(
        sortedAndFilteredArchives,
        pagination,
      ),
      refresh: () => invalidateGetArchivesCache(projectId, region),
      allArchives: archives,
      allFilteredArchives: sortedAndFilteredArchives,
      error,
    };
  }, [archives, error, isLoading, isPending, pagination, sorting, filters]);
};

export const useDeleteArchive = ({
  projectId,
  onError,
  onSuccess,
}: TBaseProps) => {
  const region = useArchiveRegion();

  const mutation = useMutation({
    mutationFn: (name: string) => deleteArchive({ projectId, region, name }),
    onError,
    onSuccess: () => {
      invalidateGetArchivesCache(projectId, region);
      onSuccess();
    },
  });

  return {
    deleteArchive: (name: string) => mutation.mutate(name),
    ...mutation,
  };
};

export const useRestoreArchive = ({
  projectId,
  onError,
  onSuccess,
}: TBaseProps) => {
  const region = useArchiveRegion();

  const mutation = useMutation({
    mutationFn: (name: string) => restoreArchive({ projectId, region, name }),
    onError,
    onSuccess: () => {
      invalidateGetArchivesCache(projectId, region);
      onSuccess();
    },
  });

  return {
    restoreArchive: (name: string) => mutation.mutate(name),
    ...mutation,
  };
};

type AddUserProps = {
  projectId: string;
  storageId: string;
  userId: number;
  role: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useAddUser = ({
  projectId,
  storageId,
  userId,
  role,
  onError,
  onSuccess,
}: AddUserProps) => {
  const region = useArchiveRegion();

  const mutation = useMutation({
    mutationFn: () =>
      addUserToContainer({ projectId, region, storageId, userId, role }),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getArchivesCacheKey(projectId, region),
      });
      onSuccess();
    },
  });

  return {
    addUser: () => mutation.mutate(),
    ...mutation,
  };
};

export const useStartArchive = ({
  projectId,
  onError,
  onSuccess,
}: TBaseProps) => {
  const region = useArchiveRegion();

  const mutation = useMutation({
    mutationFn: ({
      name,
      lockedUntilDays,
    }: {
      name: string;
      lockedUntilDays?: number;
    }) =>
      startArchive({
        projectId,
        region,
        name,
        lockedUntilDays,
      }),
    onError,
    onSuccess: () => {
      invalidateGetArchivesCache(projectId, region);
      onSuccess();
    },
  });

  return {
    startArchive: ({
      name,
      lockedUntilDays,
    }: {
      name: string;
      lockedUntilDays?: number;
    }) => mutation.mutate({ name, lockedUntilDays }),
    ...mutation,
  };
};

export const useFlushArchive = ({
  projectId,
  onError,
  onSuccess,
}: TBaseProps) => {
  const region = useArchiveRegion();

  const mutation = useMutation({
    mutationFn: (name: string) =>
      flushArchive({
        projectId,
        region,
        name,
      }),
    onError,
    onSuccess: () => {
      invalidateGetArchivesCache(projectId, region);
      onSuccess();
    },
  });

  return {
    flushArchive: (name: string) => mutation.mutate(name),
    ...mutation,
  };
};

export const useCreateContainer = ({
  projectId,
  onSuccess,
  onError,
}: {
  projectId: string;
  onSuccess?: (container: TArchiveContainer) => void;
  onError?: (error: ApiError) => void;
}) => {
  const region = useArchiveRegion();

  const mutation = useMutation({
    mutationFn: (container: { name: string; ownerId: number }) =>
      createArchiveContainer({ projectId, region, ...container }),
    onError,
    onSuccess: (result) => {
      invalidateGetArchivesCache(projectId, region);
      onSuccess?.(result);
    },
  });

  return {
    createContainer: (container: { name: string; ownerId: number }) =>
      mutation.mutate(container),
    createContainerAsync: (container: { name: string; ownerId: number }) =>
      mutation.mutateAsync(container),
    ...mutation,
  };
};
