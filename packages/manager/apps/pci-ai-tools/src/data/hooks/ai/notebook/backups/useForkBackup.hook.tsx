import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError } from '@/data/api';
import {
  BackupData,
  forkBackup,
} from '@/data/api/ai/notebook/backups/backups.api';
import ai from '@/types/AI';

interface UseForkBackup {
  onError: (cause: AIError) => void;
  onSuccess: (notebook: ai.notebook.Notebook) => void;
}

export function useForkBackup({ onError, onSuccess }: UseForkBackup) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (forkInfo: BackupData) => {
      return forkBackup(forkInfo);
    },
    onError,
    onSuccess: (data) => {
      // invalidate notebooks list to avoid displaying
      // old list
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'notebook'],
        refetchType: 'none',
      });
      onSuccess(data);
    },
  });

  return {
    forkBackup: (forkInfo: BackupData) => {
      return mutation.mutate(forkInfo);
    },
    ...mutation,
  };
}
