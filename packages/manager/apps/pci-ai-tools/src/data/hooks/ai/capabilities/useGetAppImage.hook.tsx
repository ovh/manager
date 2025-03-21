import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getAppImages } from '@/data/api/ai/capabilities/capabilities.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import ai from '@/types/AI';

export function useGetAppImages(
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
    'app',
    'image',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getAppImages({ projectId, region }),
    ...options,
  }) as UseQueryResult<ai.capabilities.app.Image[], Error>;
}
