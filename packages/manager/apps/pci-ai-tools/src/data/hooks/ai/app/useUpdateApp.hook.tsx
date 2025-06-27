import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError } from '@/data/api';
import { UpdateApp, updateApp } from '@/data/api/ai/app/app.api';
import ai from '@/types/AI';

interface UseUpdateApp {
  onError: (cause: AIError) => void;
  onUpdateSuccess: (app: ai.app.App) => void;
}

export function useUpdateApp({ onError, onUpdateSuccess }: UseUpdateApp) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (appInfo: UpdateApp) => {
      return updateApp(appInfo);
    },
    onError,
    onSuccess: (data) => {
      // Invalidate apps list query to get the latest data
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'app'],
      });
      onUpdateSuccess(data);
    },
  });

  return {
    updateApp: (appInfo: UpdateApp) => {
      return mutation.mutate(appInfo);
    },
    ...mutation,
  };
}
