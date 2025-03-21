import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError, AppData } from '@/data/api';
import { stopApp } from '@/data/api/ai/app/app.api';

interface UseStopApp {
  onError: (cause: AIError) => void;
  onStopSuccess: () => void;
}

export function useStopApp({ onError, onStopSuccess }: UseStopApp) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (appInfo: AppData) => {
      return stopApp(appInfo);
    },
    onError,
    onSuccess: () => {
      // Invalidate apps list query to get the latest data
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'app'],
      });
      onStopSuccess();
    },
  });

  return {
    stopApp: (appInfo: AppData) => {
      return mutation.mutate(appInfo);
    },
    ...mutation,
  };
}
