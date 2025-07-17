import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CdbError } from '@/data/api/database';
import * as database from '@/types/cloud/project/database';
import {
  editReplication,
  IEditReplication,
} from '@/data/api/database/replication.api';

export interface UseEditReplication {
  onError: (cause: CdbError) => void;
  onSuccess: (replication: database.service.Replication) => void;
}
export function useEditReplication({
  onError,
  onSuccess: customOnSuccess,
}: UseEditReplication) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (replicationInfo: IEditReplication) => {
      return editReplication(replicationInfo);
    },
    onError,
    onSuccess: (data, variables) => {
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
    editReplication: (replicationInfo: IEditReplication) => {
      return mutation.mutate(replicationInfo);
    },
    ...mutation,
  };
}
