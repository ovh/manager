import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ai from '@/types/AI';
import { AIError } from '@/data/api';
import {
  UpdateNotebook,
  updateNotebook,
} from '@/data/api/ai/notebook/notebook.api';

interface UseUpdateNotebook {
  onError: (cause: AIError) => void;
  onUpdateSuccess: (notebook: ai.notebook.Notebook) => void;
}

export function useUpdateNotebook({
  onError,
  onUpdateSuccess,
}: UseUpdateNotebook) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (notebookInfo: UpdateNotebook) => {
      return updateNotebook(notebookInfo);
    },
    onError,
    onSuccess: (data) => {
      // Invalidate notebooks list query to get the latest data
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'notebook'],
      });
      onUpdateSuccess(data);
    },
  });

  return {
    updateNotebook: (notebookInfo: UpdateNotebook) => {
      return mutation.mutate(notebookInfo);
    },
    ...mutation,
  };
}
