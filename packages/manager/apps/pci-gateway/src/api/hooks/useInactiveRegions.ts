import { useQuery } from '@tanstack/react-query';
import { getInactiveRegions, getInactiveRegionsUrl } from '@/api/data/regions';

export const getInactiveRegionsQuery = (projectId: string) => ({
  queryKey: [getInactiveRegionsUrl(projectId)],
  queryFn: () => getInactiveRegions(projectId),
});

export const useInactiveRegions = (projectId: string) =>
  useQuery({
    ...getInactiveRegionsQuery(projectId),
    enabled: !!projectId,
  });
