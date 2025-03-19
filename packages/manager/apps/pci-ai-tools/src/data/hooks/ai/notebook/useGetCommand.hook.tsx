import { useMutation } from '@tanstack/react-query';
import ai from '@/types/AI';
import { AIError } from '@/data/api';
import { AddNotebook, getCommand } from '@/data/api/ai/notebook/notebook.api';

interface GetCommandProps {
  onError: (cause: AIError) => void;
  onSuccess: (notebook: ai.Command) => void;
}

export function useGetCommand({ onError, onSuccess }: GetCommandProps) {
  const mutation = useMutation({
    mutationFn: (notebookInfo: AddNotebook) => {
      return getCommand(notebookInfo);
    },
    onError,
    onSuccess,
  });

  return {
    getCommand: (notebookInfo: AddNotebook) => {
      return mutation.mutate(notebookInfo);
    },
    ...mutation,
  };
}
