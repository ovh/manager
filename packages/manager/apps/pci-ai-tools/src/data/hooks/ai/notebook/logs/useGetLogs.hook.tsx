import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import { getLogs } from '@/data/api/ai/notebook/logs/logs.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import ai from '@/types/AI';

export function useGetLogs(
  projectId: string,
  notebookId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'notebook', notebookId, 'log'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getLogs({ projectId, notebookId }),
    ...options,
  }) as UseQueryResult<ai.Logs, AIError>;
}
