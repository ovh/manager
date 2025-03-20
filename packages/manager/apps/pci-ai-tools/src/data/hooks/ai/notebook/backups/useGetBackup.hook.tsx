import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import { getBackup } from '@/data/api/ai/notebook/backups/backups.api';
import { useQueryImmediateRefetch } from '@/hooks/useImmediateRefetch';
import ai from '@/types/AI';

export function useGetBackup(
  projectId: string,
  notebookId: string,
  backupId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [
    projectId,
    'ai',
    'notebook',
    notebookId,
    'backup',
    backupId,
  ];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getBackup({ projectId, notebookId, backupId }),
    ...options,
  }) as UseQueryResult<ai.notebook.Backup, AIError>;
}
