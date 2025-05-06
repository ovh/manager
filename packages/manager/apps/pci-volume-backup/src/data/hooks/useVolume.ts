import { useQuery, useMutation } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import queryClient from '@/queryClient';
import { TVolume } from '@/data/api/api.types';
import {
  createVolumeFromBackup,
  detachVolume,
  getVolume,
} from '@/data/api/volume';

export type TNewVolumeFromBackupData = {
  regionName: string;
  volumeBackupId: string;
  volumeName: string;
};

export type TCreateVolumeFromBackupArguments = {
  projectId: string;
  onSuccess: (newVolume: TVolume) => void;
  onError: (err: Error, newVolumeData: TNewVolumeFromBackupData) => void;
};

export const useVolume = (
  projectId: string | undefined,
  volumeId?: string | null,
) =>
  useQuery({
    queryKey: ['project', projectId, 'volume', volumeId],
    enabled: !!projectId && !!volumeId,
    queryFn: () =>
      getVolume(
        projectId as NonNullable<string>,
        volumeId as NonNullable<string>,
      ),
  });

export const useCreateVolumeFromBackup = ({
  projectId,
  onSuccess,
  onError,
}: TCreateVolumeFromBackupArguments) => {
  const mutation = useMutation({
    mutationFn: (data: TNewVolumeFromBackupData) =>
      createVolumeFromBackup(
        projectId,
        data.regionName,
        data.volumeBackupId,
        data.volumeName,
      ),
    onError,
    onSuccess: async (newVolume: TVolume) => {
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'volumes'],
      });
      onSuccess(newVolume);
    },
  });
  return {
    createVolumeFromBackup: (data: TNewVolumeFromBackupData) =>
      mutation.mutate(data),
    ...mutation,
  };
};

type DetachVolumeProps = {
  projectId: string;
  volumeId: string | null;
  instanceId: string | null;
  onError: (cause: ApiError) => void;
  onSuccess: (volume: TVolume) => void;
};

export const useDetachVolume = ({
  projectId,
  volumeId,
  instanceId,
  onError,
  onSuccess,
}: DetachVolumeProps) => {
  const mutation = useMutation({
    mutationFn: () =>
      detachVolume(
        projectId,
        volumeId as NonNullable<string>,
        instanceId as NonNullable<string>,
      ),
    onError,
    onSuccess: (volume: TVolume) => {
      queryClient.setQueryData(
        ['project', projectId, 'volumes'],
        (data: TVolume[]) =>
          data?.map((volumeItem) => {
            if (volumeItem.attachedTo && volumeItem.id === volumeId) {
              return { ...volume, attachedTo: [] };
            }
            return volumeItem;
          }),
      );
      queryClient.setQueryData(
        ['project', projectId, 'volume', volumeId],
        () => ({
          ...volume,
          attachedTo: [],
        }),
      );
      onSuccess(volume);
    },
  });
  return {
    detachVolume: () => mutation.mutate(),
    ...mutation,
  };
};
