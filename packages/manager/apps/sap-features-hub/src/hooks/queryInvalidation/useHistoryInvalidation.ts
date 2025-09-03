import { useQueryClient } from '@tanstack/react-query';
import { installationHistoryQueryKeys } from '@/data/hooks/useInstallationHistory';

export const useHistoryInvalidation = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({
      queryKey: installationHistoryQueryKeys,
    });
  };
};
