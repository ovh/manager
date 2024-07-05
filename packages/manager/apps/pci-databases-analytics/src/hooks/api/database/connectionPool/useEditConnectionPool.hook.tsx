import { useMutation } from '@tanstack/react-query';

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
  onSuccess,
}: UseEditConnectionPool) {
  const mutation = useMutation({
    mutationFn: (cpInfo: EditConnectionPool) => {
      return editConnectionPool(cpInfo);
    },
    onError,
    onSuccess,
  });

  return {
    editConnectionPool: (cpInfo: EditConnectionPool) => {
      return mutation.mutate(cpInfo);
    },
    ...mutation,
  };
}
