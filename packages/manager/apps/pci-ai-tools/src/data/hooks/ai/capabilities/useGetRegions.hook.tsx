import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import ai from '@/types/AI';
import { getRegions } from '@/data/api/ai/capabilities/capabilities.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

export function useGetRegions(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'capabilities', 'region'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getRegions({ projectId }),
    ...options,
  }) as UseQueryResult<ai.capabilities.Region[], Error>;
}
