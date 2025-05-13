import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  AddConnectionPool,
  addConnectionPool,
} from '@/data/api/database/connectionPool.api';
import * as database from '@/types/cloud/project/database';
import { CdbError } from '@/data/api/database';

export interface UseAddConnectionPool {
  onError: (cause: CdbError) => void;
  onSuccess: (connectionPool: database.postgresql.ConnectionPool) => void;
}
export function useAddConnectionPool({
  onError,
  onSuccess: customOnSuccess,
}: UseAddConnectionPool) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (cpInfo: AddConnectionPool) => {
      return addConnectionPool(cpInfo);
    },
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'connectionPool',
        ],
      });
      customOnSuccess(data);
    },
  });

  return {
    addConnectionPool: (cpInfo: AddConnectionPool) => {
      return mutation.mutate(cpInfo);
    },
    ...mutation,
  };
}
