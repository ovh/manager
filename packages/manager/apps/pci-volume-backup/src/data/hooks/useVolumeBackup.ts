import { ApiError } from '@ovh-ux/manager-core-api';
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useMemo } from 'react';
import { ResourcesV6Params } from '@ovh-ux/manager-react-components';
import {
  createVolumeBackup,
  createVolumeSnapshot,
  deleteBackup,
  getVolumeBackups,
  refetchInterval,
  restoreVolume,
} from '@/data/api/volumeBackup';
import { VOLUME_BACKUP_STATUS } from '@/constants';
import { TVolumeBackup } from '@/data/api/api.types';

const getBackupsQueryOptions = (projectId: string | undefined) =>
  queryOptions({
    // queryKey should be an array with only one element or call to useResourcesV6 breaks
    queryKey: [`/cloud/project/${projectId}/aggregated/volumeBackup`],
    queryFn: getVolumeBackups(projectId as NonNullable<typeof projectId>),
    enabled: !!projectId,
  });

export const getBackupsResourcesV6QueryOptions = (
  projectId: string,
): Pick<
  ResourcesV6Params<TVolumeBackup>,
  'route' | 'queryFn' | 'refetchInterval' | 'queryKey'
> => {
  const { queryKey, queryFn, ...backupsQueryOptions } = getBackupsQueryOptions(
    projectId,
  );

  return {
    ...backupsQueryOptions,
    // Route should not be required
    route: '',
    refetchInterval,
    // We need to cast as unknown because MRC typing doesn't accept tanstack queryFn
    queryFn: (queryFn as unknown) as ResourcesV6Params<
      TVolumeBackup
    >['queryFn'],
    // We need to cast as unknown because MRC typing isn't correct and queryKey is set as a list
    queryKey: (queryKey[0] as unknown) as string[],
  };
};

export const useBackups = (projectId: string | undefined) =>
  useQuery(getBackupsQueryOptions(projectId));

export const useBackup = ({
  projectId,
  volumeId,
}: {
  projectId: string | undefined;
  volumeId: string | undefined;
}) => {
  const { data: backups, isLoading, error } = useBackups(projectId);

  return useMemo(
    () => ({
      data: backups?.data?.find((backup) => backup.volumeId === volumeId),
      isLoading,
      error,
    }),
    [backups?.data, volumeId, isLoading, error],
  );
};

export const useRestoreVolume = ({
  projectId,
  regionName,
  onError,
  onSuccess,
}: {
  projectId: string;
  regionName: string;
  onError: (cause: ApiError) => void;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (params: { volumeId: string; backupId: string }) =>
      restoreVolume({
        projectId,
        regionName,
        ...params,
      }),
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries(getBackupsQueryOptions(projectId));
      onSuccess();
    },
  });

  return {
    restoreVolume: (params: { volumeId: string; backupId: string }) =>
      mutation.mutate(params),
    ...mutation,
  };
};

export const useDeleteBackup = ({
  projectId,
  regionName,
  onError,
  onSuccess,
}: {
  projectId: string;
  regionName: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
}) => {
  const queryClient = useQueryClient();

  const backupsQuery = useMemo(() => getBackupsQueryOptions(projectId), [
    projectId,
  ]);

  const mutation = useMutation({
    mutationFn: async (backupId: string) =>
      deleteBackup({
        projectId,
        regionName,
        backupId,
      }),
    onMutate: async (backupId) => {
      await queryClient.cancelQueries(backupsQuery);

      const previousBackups = queryClient.getQueryData(backupsQuery.queryKey);

      queryClient.setQueryData(backupsQuery.queryKey, (backupsData) => {
        if (!backupsData) return undefined;

        const { data, ...rest } = backupsData;
        const newData = [...data];

        const backupIndex = newData.findIndex((b) => b.id === backupId);
        if (backupIndex !== -1) {
          const newBackup = {
            ...newData[backupIndex],
            status: VOLUME_BACKUP_STATUS.DELETING,
          };

          newData.splice(backupIndex, 1, newBackup);
        }

        return {
          data: newData,
          ...rest,
        };
      });

      return { previousBackups };
    },
    onError: (error, _variables, context) => {
      if (context?.previousBackups)
        queryClient.setQueryData(
          backupsQuery.queryKey,
          context.previousBackups,
        );

      return onError(error);
    },
    onSuccess,
    onSettled: () => queryClient.invalidateQueries(backupsQuery),
  });

  return {
    deleteBackup: (backupId: string) => mutation.mutate(backupId),
    ...mutation,
  };
};

type UseCreateBackupProps = {
  projectId: string;
  onSuccess: () => void;
  onError: (error: ApiError) => void;
};

type CreateBackupProps = {
  regionName?: string;
  volumeId: string;
  backupName: string;
};

export const useCreateVolumeBackup = ({
  projectId,
  onSuccess,
  onError,
}: UseCreateBackupProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: CreateBackupProps) =>
      createVolumeBackup(
        projectId,
        params.volumeId,
        params.regionName as NonNullable<typeof params.regionName>,
        params.backupName,
      ),
    onError,
    onSuccess: async () => {
      queryClient.invalidateQueries(getBackupsQueryOptions(projectId));

      onSuccess();
    },
  });
  return {
    createVolumeBackup: (params: CreateBackupProps) => mutation.mutate(params),
    ...mutation,
  };
};

export const useCreateVolumeSnapshot = ({
  projectId,
  onSuccess,
  onError,
}: UseCreateBackupProps) => {
  const mutation = useMutation({
    mutationFn: (params: CreateBackupProps) =>
      createVolumeSnapshot(projectId, params.volumeId, params.backupName),
    onError,
    onSuccess,
  });
  return {
    createVolumeSnapshot: (params: CreateBackupProps) =>
      mutation.mutate(params),
    ...mutation,
  };
};
