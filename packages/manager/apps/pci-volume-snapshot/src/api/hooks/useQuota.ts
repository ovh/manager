import { useQuery } from '@tanstack/react-query';
import { getRegionsQuota } from '@/api/data/quota';

export const useRegionsQuota = (projectId: string, region: string) =>
  useQuery({
    queryKey: ['project', projectId, 'region', region, 'quota'],
    queryFn: () => getRegionsQuota(projectId, region),
  });
