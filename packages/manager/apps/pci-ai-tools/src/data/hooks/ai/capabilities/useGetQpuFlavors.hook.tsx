import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getQpuFlavors } from '@/data/api/ai/capabilities/capabilities.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import quantum from '@/types/Quantum';

export function useGetQpuFlavors(
  projectId: string,
  region: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [
    projectId,
    'quantum',
    'capabilities',
    'region',
    region,
    'qpu',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getQpuFlavors({ projectId, region }),
    ...options,
  }) as UseQueryResult<quantum.capabilities.QPUFlavor[], Error>;
}
