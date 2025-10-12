import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getQPUFlavor } from '@/data/api/ai/capabilities/capabilities.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch'; 
import { Qpu } from '@/types/orderFunnel';

export function useGetQPUFlavor(
  projectId: string,
  region: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [
    projectId,
    'ai',
    'capabilities',
    'region',
    region,
    'qpuFlavor',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getQPUFlavor({ projectId, region }),
    ...options,
  }) as UseQueryResult<Qpu[], Error>;
}
