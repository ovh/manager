import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addProjectRegion, getProjectRegions } from '../data/regions';

export const useGetProjectRegionsQuery = (projectId: string) => ({
  queryKey: ['project', projectId, 'regions'],
  queryFn: () => getProjectRegions(projectId),
});

export const useGetProjectRegions = (projectId: string) =>
  useQuery({
    ...useGetProjectRegionsQuery(projectId),
  });

export interface AddProjectRegionProps {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['project', projectId, 'regions'],
      });
      onSuccess();
    },
  });
  return {
    addRegion: (region: string) => mutation.mutate(region),
    ...mutation,
  };
};
