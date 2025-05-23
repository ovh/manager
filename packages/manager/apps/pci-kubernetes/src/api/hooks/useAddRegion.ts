import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProjectRegion } from '../data/regions';

export interface AddProjectRegionProps {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: (data: unknown, variables: string, context: unknown) => void;
}

export const useAddProjectRegion = ({
  projectId,
  onError,
  onSuccess,
}: AddProjectRegionProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (region: string) => addProjectRegion(projectId, region),
    onError,
    onSuccess: async (...arg) => {
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'regions'],
      });
      onSuccess(...arg);
    },
  });
  return {
    addRegion: (region: string) => mutation.mutate(region),
    ...mutation,
  };
};
