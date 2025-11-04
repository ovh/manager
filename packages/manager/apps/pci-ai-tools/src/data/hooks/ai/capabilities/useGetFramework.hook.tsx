import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import ai from '@/types/AI';
import { getFramework } from '@/data/api/ai/capabilities/capabilities.api';

export function useGetFramework(
  projectId: string,
  region: string,
  type?: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [
    projectId,
    'ai',
    'capabilities',
    'region',
    region,
    type,
    'framework',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getFramework({ projectId, region, type }),
    ...options,
  }) as UseQueryResult<ai.capabilities.notebook.Framework[], Error>;
}
