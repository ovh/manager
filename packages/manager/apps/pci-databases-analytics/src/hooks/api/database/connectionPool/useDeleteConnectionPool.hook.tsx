import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  onSuccess: customOnSuccess,
}: UseDeleteConnectionPool) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (connectionPoolInfo: DeleteConnectionPool) => {
      return deleteConnectionPool(connectionPoolInfo);
    },
    onError,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'connectionPool',
        ],
      });
      customOnSuccess();
    },
  });

  return {
    deleteConnectionPool: (connectionPoolInfo: DeleteConnectionPool) => {
      return mutation.mutate(connectionPoolInfo);
    },
    ...mutation,
  };
}
