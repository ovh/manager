import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import { getBackups } from '@/data/api/ai/notebook/backups/backups.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import ai from '@/types/AI';

export function useGetBackups(
  projectId: string,
  notebookId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'ai', 'notebook', notebookId, 'backup'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getBackups({ projectId, notebookId }),
    ...options,
  }) as UseQueryResult<ai.notebook.Backup[], AIError>;
}
