import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import {
  IOperationConnector,
  restartConnector,
} from '@/data/api/database/connector.api';

export interface UseRestartConnector {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useRestartConnector({
  onError,
  onSuccess: customOnSuccess,
}: UseRestartConnector) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (connectorInfos: IOperationConnector) => {
      return restartConnector(connectorInfos);
    },
    onError,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'connector',
        ],
      });
      customOnSuccess();
    },
  });

  return {
    restartConnector: (connectorInfos: IOperationConnector) => {
      return mutation.mutate(connectorInfos);
    },
    ...mutation,
  };
}
