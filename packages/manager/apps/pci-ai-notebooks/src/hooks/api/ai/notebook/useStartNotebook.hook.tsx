import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError, NotebookData } from '@/data/api';
import { startNotebook } from '@/data/api/ai/notebook/notebook.api';

interface UseStartNotebook {
  onError: (cause: AIError) => void;
  onStartSuccess: () => void;
}

export function useStartNotebook({
  onError,
  onStartSuccess,
}: UseStartNotebook) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (notebookInfo: NotebookData) => {
      return startNotebook(notebookInfo);
    },
    onError,
    onSuccess: () => {
      // Invalidate service list query to get the latest data
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai/notebook'],
      });
      onStartSuccess();
    },
  });

  return {
    startNotebook: (notebookInfo: NotebookData) => {
      return mutation.mutate(notebookInfo);
    },
    ...mutation,
  };
}
