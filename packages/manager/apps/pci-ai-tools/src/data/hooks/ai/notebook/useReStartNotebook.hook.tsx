import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError, NotebookData } from '@/data/api';
import { reStartNotebook } from '@/data/api/ai/notebook/notebook.api';

interface UseReStartNotebook {
  onError: (cause: AIError) => void;
  onReStartSuccess: () => void;
}

export function useReStartNotebook({
  onError,
  onReStartSuccess,
}: UseReStartNotebook) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (notebookInfo: NotebookData) => {
      return reStartNotebook(notebookInfo);
    },
    onError,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'notebook'],
      });
      onReStartSuccess();
    },
  });

  return {
    reStartNotebook: (notebookInfo: NotebookData) => {
      return mutation.mutate(notebookInfo);
    },
    ...mutation,
  };
}
