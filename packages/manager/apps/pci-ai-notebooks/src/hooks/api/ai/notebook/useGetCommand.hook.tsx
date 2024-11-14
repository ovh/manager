import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useParams } from 'react-router-dom';
import * as ai from '@/types/cloud/project/ai';
import { AIError } from '@/data/api';
import { getCommand } from '@/data/api/ai/notebook/command.api';

interface GetCommandProps {
  onError: (cause: AIError) => void;
  onSuccess: (notebook: ai.Command) => void;
}

export function useGetCommand({ onError, onSuccess }: GetCommandProps) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (notebookInfo: ai.notebook.NotebookSpec) => {
      return getCommand({ projectId, notebookInfo });
    },
    onError,
    onSuccess: (data) => {
      // invalidate services list to avoid displaying
      // old list
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai/notebook'],
        refetchType: 'none',
      });
      onSuccess(data);
    },
  });

  return {
    getCommand: (notebookInfo: ai.notebook.NotebookSpec) => {
      return mutation.mutate(notebookInfo);
    },
    ...mutation,
  };
}
