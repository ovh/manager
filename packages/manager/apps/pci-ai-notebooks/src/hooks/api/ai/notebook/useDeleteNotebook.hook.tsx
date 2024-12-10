import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError, NotebookData } from '@/data/api';
import { deleteNotebook } from '@/data/api/ai/notebook/notebook.api';

interface UseDeleteNotebook {
  onError: (cause: AIError) => void;
  onSuccess: () => void;
}

export function useDeleteNotebook({
  onError,
  onSuccess,
}: UseDeleteNotebook) {
  const mutation = useMutation({
    mutationFn: (notebookInfo: NotebookData) => {
      return deleteNotebook(notebookInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteNotebook: (notebookInfo: NotebookData) => {
      return mutation.mutate(notebookInfo);
    },
    ...mutation,
  };
}