import { useQuery, useMutation } from '@tanstack/react-query';
import queryClient from '@/queryClient';
import { TVolume } from '@/data/api/api.types';
import { createVolumeFromBackup, getVolume } from '@/data/api/volume';

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

export const useVolume = (projectId: string, volumeId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'volume', volumeId],
    enabled: !!projectId && !!volumeId,
    queryFn: () => getVolume(projectId, volumeId),
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
