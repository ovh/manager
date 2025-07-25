import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import {
  IOperationConnector,
  resumeConnector,
} from '@/data/api/database/connector.api';
import * as database from '@/types/cloud/project/database';

export interface UseResumeConnector {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useResumeConnector({
  onError,
  onSuccess: customOnSuccess,
}: UseResumeConnector) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (connectorInfos: IOperationConnector) => {
      return resumeConnector(connectorInfos);
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
                  status: database.kafkaConnect.connector.StatusEnum.RUNNING,
                }
              : connector,
          ),
      );
      customOnSuccess();
    },
  });

  return {
    resumeConnector: (connectorInfos: IOperationConnector) => {
      return mutation.mutate(connectorInfos);
    },
    ...mutation,
  };
}
