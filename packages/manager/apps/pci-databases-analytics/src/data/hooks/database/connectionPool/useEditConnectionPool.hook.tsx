import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  EditConnectionPool,
  editConnectionPool,
} from '@/data/api/database/connectionPool.api';
import * as database from '@/types/cloud/project/database';
import { CdbError } from '@/data/api/database';

export interface UseEditConnectionPool {
  onError: (cause: CdbError) => void;
  onSuccess: (connectionPool: database.postgresql.ConnectionPool) => void;
}
export function useEditConnectionPool({
  onError,
  onSuccess: customOnSuccess,
}: UseEditConnectionPool) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (cpInfo: EditConnectionPool) => {
      return editConnectionPool(cpInfo);
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
    editConnectionPool: (cpInfo: EditConnectionPool) => {
      return mutation.mutate(cpInfo);
    },
    ...mutation,
  };
}
