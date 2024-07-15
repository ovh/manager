import { useQuery } from '@tanstack/react-query';
import { getRegions } from '@/api/data/regions';

export const getRegionsQuery = (projectId: string) => ({
  queryKey: ['regions'],
  queryFn: () => getRegions(projectId),
});

export const useRegions = (projectId: string) =>
  useQuery({
    ...getRegionsQuery(projectId),
  });
