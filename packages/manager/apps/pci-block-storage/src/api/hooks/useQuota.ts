import { useQuery } from '@tanstack/react-query';
import { getRegionsQuota } from '@/api/data/quota';

export const useRegionsQuota = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'quota'],
    queryFn: () => getRegionsQuota(projectId),
  });
