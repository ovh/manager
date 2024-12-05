import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as ai from '@/types/cloud/project/ai';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { AIError } from '@/data/api';
import { getBackup } from '@/data/api/ai/notebook/backups/backups.api';

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
