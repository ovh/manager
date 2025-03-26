import { useMutation } from '@tanstack/react-query';
import queryClient from '@/queryClient';
import { TVolume } from '@/api/api.types';
import { createVolume, NewVolumeData } from '@/api/data/volume';

export interface CreateVolumeArguments {
  projectId: string;
  onSuccess: (newVolume: TVolume) => void;
  onError: (err: Error, newVolumeData: NewVolumeData) => void;
}

export const useCreateVolume = ({
  projectId,
  onSuccess,
  onError,
}: CreateVolumeArguments) => {
  const mutation = useMutation({
    mutationFn: (newVolumeData: NewVolumeData) =>
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
    createVolume: (newVolumeData: NewVolumeData) =>
      mutation.mutate(newVolumeData),
    ...mutation,
  };
};
