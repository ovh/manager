import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError, NotebookData } from '@/data/api';
import { stopNotebook } from '@/data/api/ai/notebook/notebook.api';

interface UseStopNotebook {
  onError: (cause: AIError) => void;
  onStopSuccess: () => void;
}

export function useStopNotebook({ onError, onStopSuccess }: UseStopNotebook) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (notebookInfo: NotebookData) => {
      return stopNotebook(notebookInfo);
    },
    onError,
    onSuccess: () => {
      // Invalidate service list query to get the latest data
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai/notebook'],
      });
      onStopSuccess();
    },
  });

  return {
    stopNotebook: (notebookInfo: NotebookData) => {
      return mutation.mutate(notebookInfo);
    },
    ...mutation,
  };
}
