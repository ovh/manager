import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { addNotebook } from '@/data/api/ai/notebook/notebook.api';
import ai from '@/types/AI';
import { AIError } from '@/data/api';

interface AddNotebookProps {
  onError: (cause: AIError) => void;
  onSuccess: (notebook: ai.notebook.Notebook) => void;
}

export function useAddNotebook({ onError, onSuccess }: AddNotebookProps) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (notebookInfo: ai.notebook.NotebookSpecInput) => {
      return addNotebook({ projectId, notebookInfo });
    },
    onError,
    onSuccess: (data) => {
      // invalidate notebook list to avoid displaying
      // old list
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'notebook'],
        refetchType: 'none',
      });
      onSuccess(data);
    },
  });

  return {
    addNotebook: (notebookInfo: ai.notebook.NotebookSpecInput) => {
      return mutation.mutate(notebookInfo);
    },
    ...mutation,
  };
}
