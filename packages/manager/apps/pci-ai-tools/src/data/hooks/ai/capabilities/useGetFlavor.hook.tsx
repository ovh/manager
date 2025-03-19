import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getFlavor } from '@/data/api/ai/capabilities/capabilities.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import ai from '@/types/AI';

export function useGetFlavor(
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
    'flavor',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getFlavor({ projectId, region }),
    ...options,
  }) as UseQueryResult<ai.capabilities.Flavor[], Error>;
}
