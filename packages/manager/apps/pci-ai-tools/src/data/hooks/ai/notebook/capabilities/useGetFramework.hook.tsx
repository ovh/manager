import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { getFramework } from '@/data/api/ai/notebook/capabilities/framework.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import ai from '@/types/AI';

export function useGetFramework(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'notebook', 'capabilities', 'framework'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getFramework({ projectId }),
    ...options,
  }) as UseQueryResult<ai.capabilities.notebook.Framework[], Error>;
}
