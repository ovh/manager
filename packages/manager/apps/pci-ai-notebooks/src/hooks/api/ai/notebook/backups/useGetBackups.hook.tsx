import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { AIError } from '@/data/api';
import { getBackups } from '@/data/api/ai/notebook/backups/backups.api';

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
