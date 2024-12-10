import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  DeleteDatabase,
  deleteDatabase,
} from '@/data/api/database/database.api';
import { CdbError } from '@/data/api/database';

interface UseDeleteDatabase {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useDeleteDatabase({
  onError,
  onSuccess: customOnSuccess,
}: UseDeleteDatabase) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (databaseInfo: DeleteDatabase) => {
      return deleteDatabase(databaseInfo);
    },
    onError,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'database',
        ],
      });
      customOnSuccess();
    },
  });

  return {
    deleteDatabase: (databaseInfo: DeleteDatabase) => {
      return mutation.mutate(databaseInfo);
    },
    ...mutation,
  };
}
