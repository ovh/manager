import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import {
  deleteReplication,
  IDeleteReplication,
} from '@/data/api/database/replication.api';

export interface UseDeletReplication {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useDeleteReplication({
  onError,
  onSuccess: customOnSuccess,
}: UseDeletReplication) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (replicationInfo: IDeleteReplication) => {
      return deleteReplication(replicationInfo);
    },
    onError,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'replication',
        ],
      });
      customOnSuccess();
    },
  });

  return {
    deleteReplication: (replicationInfo: IDeleteReplication) => {
      return mutation.mutate(replicationInfo);
    },
    ...mutation,
  };
}
