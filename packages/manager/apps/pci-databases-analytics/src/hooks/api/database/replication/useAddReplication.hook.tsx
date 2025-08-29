import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import * as database from '@/types/cloud/project/database';
import {
  addReplication,
  IAddReplication,
} from '@/data/api/database/replication.api';

export interface UseAddReplication {
  onError: (cause: CdbError) => void;
  onSuccess: (replication: database.service.Replication) => void;
}
export function useAddReplication({
  onError,
  onSuccess: customOnSuccess,
}: UseAddReplication) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (replicationInfo: IAddReplication) => {
      return addReplication(replicationInfo);
    },
    onError,
    onSuccess: (data: database.service.Replication, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'replication',
        ],
      });
      customOnSuccess(data);
    },
  });

  return {
    addReplication: (replicationInfo: IAddReplication) => {
      return mutation.mutate(replicationInfo);
    },
    ...mutation,
  };
}
