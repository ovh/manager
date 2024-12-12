import { useQuery } from '@tanstack/react-query';
import { getGateways } from '@/api/data/regions';

export const useGateways = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'gateway'],
    queryFn: () => getGateways(projectId),
  });
