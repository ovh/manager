import { useMutation } from '@tanstack/react-query';
import {
  DeleteConnectionPool,
  deleteConnectionPool,
} from '@/data/api/database/connectionPool.api';
import { CdbError } from '@/data/api/database';

interface UseDeleteConnectionPool {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}

export function useDeleteConnectionPool({
  onError,
  onSuccess,
}: UseDeleteConnectionPool) {
  const mutation = useMutation({
    mutationFn: (connectionPoolInfo: DeleteConnectionPool) => {
      return deleteConnectionPool(connectionPoolInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteConnectionPool: (connectionPoolInfo: DeleteConnectionPool) => {
      return mutation.mutate(connectionPoolInfo);
    },
    ...mutation,
  };
}
