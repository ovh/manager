import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { CdbError } from '@/data/api/database';
import { IAddConnector, addConnector } from '@/data/api/database/connector.api';

export interface UseAddConnector {
  onError: (cause: CdbError) => void;
  onSuccess: (connector: database.kafkaConnect.Connector) => void;
}
export function useAddConnector({
  onError,
  onSuccess: customOnSuccess,
}: UseAddConnector) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (connectorInfos: IAddConnector) => {
      return addConnector(connectorInfos);
    },
    onError,
    onSuccess: (data: database.kafkaConnect.Connector, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'connector',
        ],
      });
      customOnSuccess(data);
    },
  });

  return {
    addConnector: (connectorInfos: IAddConnector) => {
      return mutation.mutate(connectorInfos);
    },
    ...mutation,
  };
}
