import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getQpuRegions } from '@/data/api/ai/capabilities/capabilities.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import quantum from '@/types/Quantum';

export function useGetQpuRegions(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'quantum', 'capabilities', 'region'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getQpuRegions({ projectId }),
    ...options,
  }) as UseQueryResult<quantum.capabilities.Region[], Error>;
}
