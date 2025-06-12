import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import ai from '@/types/AI';
import { AIError } from '@/data/api';
import { addApp } from '@/data/api/ai/app/app.api';

interface AddAppProps {
  onError: (cause: AIError) => void;
  onSuccess: (app: ai.app.App) => void;
}

export function useAddApp({ onError, onSuccess }: AddAppProps) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (appInfo: ai.app.AppSpecInput) => {
      return addApp({ projectId, appInfo });
    },
    onError,
    onSuccess: (data) => {
      // invalidate applist to avoid displaying
      // old list
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'app'],
      });
      onSuccess(data);
    },
  });

  return {
    addApp: (appInfo: ai.app.AppSpecInput) => {
      return mutation.mutate(appInfo);
    },
    ...mutation,
  };
}
