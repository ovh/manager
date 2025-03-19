import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import ai from '@/types/AI';
import { getNotebook } from '@/data/api/ai/notebook/notebook.api';
import { AIError } from '@/data/api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';

export function useGetNotebook(
  projectId: string,
  notebookId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'notebook', notebookId];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getNotebook({ projectId, notebookId }),
    ...options,
  }) as UseQueryResult<ai.notebook.Notebook, AIError>;
}
