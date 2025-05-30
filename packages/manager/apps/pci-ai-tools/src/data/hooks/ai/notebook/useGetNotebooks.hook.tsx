import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import ai from '@/types/AI';
import { getNotebooks } from '@/data/api/ai/notebook/notebook.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

export function useGetNotebooks(
  projectId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'notebook'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getNotebooks({ projectId }),
    ...options,
  }) as UseQueryResult<ai.notebook.Notebook[], Error>;
}
