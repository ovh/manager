import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import {
  IOperationConnector,
  pauseConnector,
} from '@/data/api/database/connector.api';
import * as database from '@/types/cloud/project/database';

export interface UsePauseConnector {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function usePauseConnector({
  onError,
  onSuccess: customOnSuccess,
}: UsePauseConnector) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (connectorInfos: IOperationConnector) => {
      return pauseConnector(connectorInfos);
    },
    onError,
    onSuccess: (_data, variables) => {
      queryClient.setQueryData(
        [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'connector',
        ],
        (oldData: database.kafkaConnect.Connector[]) =>
          oldData.map((connector) =>
            connector.id === variables.connectorId
              ? {
                  ...connector,
                  status: database.kafkaConnect.connector.StatusEnum.PAUSED,
                }
              : connector,
          ),
      );
      customOnSuccess();
    },
  });

  return {
    pauseConnector: (connectorInfos: IOperationConnector) => {
      return mutation.mutate(connectorInfos);
    },
    ...mutation,
  };
}
