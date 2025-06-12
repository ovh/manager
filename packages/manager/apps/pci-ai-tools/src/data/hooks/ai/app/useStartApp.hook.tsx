import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError, AppData } from '@/data/api';
import { startApp } from '@/data/api/ai/app/app.api';

interface UseStartApp {
  onError: (cause: AIError) => void;
  onStartSuccess: () => void;
}

export function useStartApp({ onError, onStartSuccess }: UseStartApp) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (appInfo: AppData) => {
      return startApp(appInfo);
    },
    onError,
    onSuccess: () => {
      // Invalidate apps list query to get the latest data
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'app'],
      });
      onStartSuccess();
    },
  });

  return {
    startApp: (appInfo: AppData) => {
      return mutation.mutate(appInfo);
    },
    ...mutation,
  };
}
