import { useQuery } from '@tanstack/react-query';
import { getProjectRegions } from '@/api/data/regions';

export const useProjectRegions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'regions'],
    queryFn: () => getProjectRegions(projectId),
  });
