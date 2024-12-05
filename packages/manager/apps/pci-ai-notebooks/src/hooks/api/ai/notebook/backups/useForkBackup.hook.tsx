import { useMutation } from '@tanstack/react-query';
import { AIError } from '@/data/api';
import * as ai from '@/types/cloud/project/ai';
import {
  BackupData,
  forkBackup,
} from '@/data/api/ai/notebook/backups/backups.api';

interface UseForkBackup {
  onError: (cause: AIError) => void;
  onSuccess: (notebook: ai.notebook.Notebook) => void;
}

export function useForkBackup({ onError, onSuccess }: UseForkBackup) {
  const mutation = useMutation({
    mutationFn: (forkInfo: BackupData) => {
      return forkBackup(forkInfo);
    },
    onError,
    onSuccess,
  });

  return {
    forkBackup: (forkInfo: BackupData) => {
      return mutation.mutate(forkInfo);
    },
    ...mutation,
  };
}
