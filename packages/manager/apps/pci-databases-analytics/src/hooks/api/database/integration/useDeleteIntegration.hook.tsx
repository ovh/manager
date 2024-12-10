import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DeleteIntegration,
  deleteIntegration,
} from '@/data/api/database/integration.api';
import { CdbError } from '@/data/api/database';

interface UseDeleteIntegration {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useDeleteIntegration({
  onError,
  onSuccess: customOnSuccess,
}: UseDeleteIntegration) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (integrationInfo: DeleteIntegration) => {
      return deleteIntegration(integrationInfo);
    },
    onError,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'integration',
        ],
      });
      customOnSuccess();
    },
  });

  return {
    deleteIntegration: (integrationInfo: DeleteIntegration) => {
      return mutation.mutate(integrationInfo);
    },
    ...mutation,
  };
}
