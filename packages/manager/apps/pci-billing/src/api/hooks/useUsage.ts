import { useQuery } from '@tanstack/react-query';
import { getUsage, TUsageKind } from '@/api/data/usage';

const getUsageQuery = (projectId: string, kind: TUsageKind) => ({
  queryKey: ['project', projectId, 'usage', kind],
  queryFn: () => getUsage(projectId, kind),
});

export const useUsage = (projectId: string, kind: TUsageKind) =>
  useQuery({
    ...getUsageQuery(projectId, kind),
    enabled: !!projectId,
    retry: 1,
  });
