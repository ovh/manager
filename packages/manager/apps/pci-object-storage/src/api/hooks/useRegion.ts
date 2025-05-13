import { useQuery } from '@tanstack/react-query';
import { getRegion } from '@/api/data/region';

export const useGetRegion = (projectId: string, region: string) => {
  return useQuery({
    queryKey: ['project', projectId, 'region', region],
    queryFn: () => getRegion(projectId, region),
    enabled: !!projectId && !!region,
  });
};
