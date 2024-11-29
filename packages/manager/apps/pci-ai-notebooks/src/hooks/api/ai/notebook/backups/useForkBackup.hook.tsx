import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError } from '@/data/api';
import * as ai from '@/types/cloud/project/ai';
import {
  ForkBackupData,
  forkBackup,
} from '@/data/api/ai/notebook/backups/backups.api';

interface UseForkBackup {
  onError: (cause: AIError) => void;
  onSuccess: (notebook: ai.notebook.Notebook) => void;
}

export function useForkBackup({ onError, onSuccess }: UseForkBackup) {
  const mutation = useMutation({
    mutationFn: (forkInfo: ForkBackupData) => {
      return forkBackup(forkInfo);
    },
    onError,
    onSuccess,
  });

  return {
    forkBackup: (forkInfo: ForkBackupData) => {
      return mutation.mutate(forkInfo);
    },
    ...mutation,
  };
}
