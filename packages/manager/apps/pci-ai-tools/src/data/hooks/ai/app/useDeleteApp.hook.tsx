import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { AIError, AppData } from '@/data/api';
import { deleteApp } from '@/data/api/ai/app/app.api';

interface UseDeleteApp {
  onError: (cause: AIError) => void;
  onDeleteSuccess: () => void;
}

export function useDeleteApp({ onError, onDeleteSuccess }: UseDeleteApp) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (appInfo: AppData) => {
      return deleteApp(appInfo);
    },
    onError,
    onSuccess: () => {
      // Invalidate apps list query to get the latest data
      queryClient.invalidateQueries({
        queryKey: [projectId, 'ai', 'app'],
      });
      onDeleteSuccess();
    },
  });

  return {
    deleteApp: (appInfo: AppData) => {
      return mutation.mutate(appInfo);
    },
    ...mutation,
  };
}
