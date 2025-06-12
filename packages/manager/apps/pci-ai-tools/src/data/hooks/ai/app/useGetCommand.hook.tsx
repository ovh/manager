import { useMutation } from '@tanstack/react-query';
import ai from '@/types/AI';
import { AIError } from '@/data/api';
import { AddApp, getCommand } from '@/data/api/ai/app/app.api';

interface GetCommandProps {
  onError: (cause: AIError) => void;
  onSuccess: (app: ai.Command) => void;
}

export function useGetCommand({ onError, onSuccess }: GetCommandProps) {
  const mutation = useMutation({
    mutationFn: (appInfo: AddApp) => {
      return getCommand(appInfo);
    },
    onError,
    onSuccess,
  });

  return {
    getCommand: (appInfo: AddApp) => {
      return mutation.mutate(appInfo);
    },
    ...mutation,
  };
}
