import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { CdbError } from '@/data/api/database';
import {
  IEditConnector,
  editConnector,
} from '@/data/api/database/connector.api';

export interface UseEditConnector {
  onError: (cause: CdbError) => void;
  onSuccess: (connector: database.kafkaConnect.Connector) => void;
}
export function useEditConnector({
  onError,
  onSuccess: customOnSuccess,
}: UseEditConnector) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (connectorInfos: IEditConnector) => {
      return editConnector(connectorInfos);
    },
    onError,
    onSuccess: (data, variables) => {
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
    editConnector: (connectorInfos: IEditConnector) => {
      return mutation.mutate(connectorInfos);
    },
    ...mutation,
  };
}
