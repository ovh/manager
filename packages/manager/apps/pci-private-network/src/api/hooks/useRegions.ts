import { useQuery } from '@tanstack/react-query';
import { getProjectRegions } from '@/api/data/project';

export const useProjectRegions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'regions'],
    queryFn: () => getProjectRegions(projectId),
  });
