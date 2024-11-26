import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { getNotebook } from '@/data/api/ai/notebook/notebook.api';
import { AIError } from '@/data/api';

export function useGetNotebook(
  projectId: string,
  notebookId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai/notebook', notebookId];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getNotebook({ projectId, notebookId }),
    ...options,
  }) as UseQueryResult<ai.notebook.Notebook, AIError>;
}
