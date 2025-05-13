import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import {
  AddIntegration,
  addIntegration,
} from '@/data/api/database/integration.api';
import { CdbError } from '@/data/api/database';

interface UseAddIntegration {
  onError: (cause: CdbError) => void;
  onSuccess: (database: database.service.Integration) => void;
}
export function useAddIntegration({
  onError,
  onSuccess: customOnSuccess,
}: UseAddIntegration) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (integrationInfo: AddIntegration) => {
      return addIntegration(integrationInfo);
    },
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'integration',
        ],
      });
      customOnSuccess(data);
    },
  });

  return {
    addIntegration: (integrationInfo: AddIntegration) => {
      return mutation.mutate(integrationInfo);
    },
    ...mutation,
  };
}
