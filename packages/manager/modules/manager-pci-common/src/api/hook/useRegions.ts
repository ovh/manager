import { useQuery } from '@tanstack/react-query';
import { getProjectRegions } from '../data/regions';

export const useGetProjectRegionsQuery = (projectId: string) => ({
  queryKey: ['project', projectId, 'regions'],
  queryFn: () => getProjectRegions(projectId),
});

export const useGetProjectRegions = (projectId: string) =>
  useQuery({
    ...useGetProjectRegionsQuery(projectId),
  });
