import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import ai from '@/types/AI';
import { getEditor } from '@/data/api/ai/capabilities/capabilities.api';

export function useGetEditor(
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
    'editor',
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getEditor({ projectId, region }),
    ...options,
  }) as UseQueryResult<ai.capabilities.notebook.Editor[], Error>;
}
