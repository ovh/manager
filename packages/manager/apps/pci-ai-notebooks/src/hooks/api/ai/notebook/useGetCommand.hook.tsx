import { useMutation } from '@tanstack/react-query';

import { useParams } from 'react-router-dom';
import * as ai from '@/types/cloud/project/ai';
import { AIError } from '@/data/api';
import { getCommand } from '@/data/api/ai/notebook/notebook.api';

interface GetCommandProps {
  onError: (cause: AIError) => void;
  onSuccess: (notebook: ai.Command) => void;
}

export function useGetCommand({ onError, onSuccess }: GetCommandProps) {
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (notebookInfo: ai.notebook.NotebookSpecInput) => {
      return getCommand({ projectId, notebookInfo });
    },
    onError,
    onSuccess,
  });

  return {
    getCommand: (notebookInfo: ai.notebook.NotebookSpecInput) => {
      return mutation.mutate(notebookInfo);
    },
    ...mutation,
  };
}
