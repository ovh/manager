import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError, NotebookData } from '@/data/api';
import { deleteNotebook } from '@/data/api/ai/notebook/notebook.api';

interface UseDeleteNotebook {
  onError: (cause: AIError) => void;
  onDeleteSuccess: () => void;
}

export function useDeleteNotebook({
  onError,
  onDeleteSuccess,
}: UseDeleteNotebook) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (notebookInfo: NotebookData) => {
      return deleteNotebook(notebookInfo);
    },
    onError,
    onSuccess: () => {
      onDeleteSuccess();
      // Invalidate service list query to get the latest data
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai/notebook'],
      });
    },
  });

  return {
    deleteNotebook: (notebookInfo: NotebookData) => {
      return mutation.mutate(notebookInfo);
    },
    ...mutation,
  };
}
