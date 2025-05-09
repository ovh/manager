import { ApiError } from '@ovh-ux/manager-core-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  createVolumeBackup,
  createVolumeSnapshot,
  deleteBackup,
  getVolumeBackups,
  restoreVolume,
} from '@/data/api/volumeBackup';
import queryClient from '@/queryClient';

export const backupsQueryKey = (projectId: string | undefined) => [
  'pci-volume-backup',
  `/cloud/project/${projectId}/aggregated/volumeBackup`,
];

export const useBackups = (projectId: string | undefined) =>
  useQuery({
    queryKey: backupsQueryKey(projectId),
    queryFn: getVolumeBackups(projectId as NonNullable<typeof projectId>),
    enabled: !!projectId,
  });

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
  const mutation = useMutation({
    mutationFn: async (params: { volumeId: string; backupId: string }) =>
      restoreVolume({
        projectId,
        regionName,
        ...params,
      }),
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: backupsQueryKey(projectId),
      });
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
  onError: (cause: ApiError) => void;
  onSuccess: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: async (backupId: string) =>
      deleteBackup({
        projectId,
        regionName,
        backupId,
      }),
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: backupsQueryKey(projectId),
      });
      onSuccess();
    },
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
      queryClient.invalidateQueries({
        queryKey: backupsQueryKey(projectId),
      });

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
