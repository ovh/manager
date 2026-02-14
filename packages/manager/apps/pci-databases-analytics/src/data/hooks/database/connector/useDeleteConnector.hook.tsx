import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import {
  IOperationConnector,
  deleteConnector,
} from '@/data/api/database/connector.api';

export interface UseDeleteConnector {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useDeleteConnector({
  onError,
  onSuccess: customOnSuccess,
}: UseDeleteConnector) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (connectorInfos: IOperationConnector) => {
      return deleteConnector(connectorInfos);
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
    deleteConnector: (connectorInfos: IOperationConnector) => {
      return mutation.mutate(connectorInfos);
    },
    ...mutation,
  };
}
