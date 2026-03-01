import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import { IRestartTask, restartTask } from '@/data/api/database/connector.api';

export interface UseRestartTask {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useRestartTask({
  onError,
  onSuccess: customOnSuccess,
}: UseRestartTask) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (connectorInfos: IRestartTask) => {
      return restartTask(connectorInfos);
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
          variables.connectorId,
          'task',
        ],
      });
      customOnSuccess();
    },
  });

  return {
    restartTask: (connectorInfos: IRestartTask) => {
      return mutation.mutate(connectorInfos);
    },
    ...mutation,
  };
}
