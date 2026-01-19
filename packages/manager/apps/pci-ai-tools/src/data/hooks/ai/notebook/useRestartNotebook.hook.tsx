import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError, NotebookData } from '@/data/api';
import { restartNotebook } from '@/data/api/ai/notebook/notebook.api';

interface UseRestartNotebook {
  onError: (cause: AIError) => void;
  onSuccess: () => void;
}

export function useRestartNotebook({ onError, onSuccess }: UseRestartNotebook) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (notebookInfo: NotebookData) => {
      return restartNotebook(notebookInfo);
    },
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'notebook'],
      });
      onSuccess();
    },
  });

  return {
    restartNotebook: mutation.mutate,
    ...mutation,
  };
}
