import { useMutation } from '@tanstack/react-query';
import queryClient from '@/queryClient';
import { TVolume } from '@/api/api.types';
import { createVolume, TNewVolumeData } from '@/api/data/volume';

export type TCreateVolumeArguments = {
  projectId: string;
  onSuccess: (newVolume: TVolume) => void;
  onError: (err: Error, newVolumeData: TNewVolumeData) => void;
};

export const useCreateVolume = ({
  projectId,
  onSuccess,
  onError,
}: TCreateVolumeArguments) => {
  const mutation = useMutation({
    mutationFn: (newVolumeData: TNewVolumeData) =>
      createVolume(projectId, newVolumeData),
    onError,
    onSuccess: async (newVolume: TVolume) => {
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'volumes'],
      });
      onSuccess(newVolume);
    },
  });
  return {
    createVolume: (newVolumeData: TNewVolumeData) =>
      mutation.mutate(newVolumeData),
    ...mutation,
  };
};
