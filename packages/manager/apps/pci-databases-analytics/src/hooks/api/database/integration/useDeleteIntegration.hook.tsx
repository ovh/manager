import { useMutation } from '@tanstack/react-query';
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
  onSuccess,
}: UseDeleteIntegration) {
  const mutation = useMutation({
    mutationFn: (integrationInfo: DeleteIntegration) => {
      return deleteIntegration(integrationInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteIntegration: (integrationInfo: DeleteIntegration) => {
      return mutation.mutate(integrationInfo);
    },
    ...mutation,
  };
}
