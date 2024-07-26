import { useMutation } from '@tanstack/react-query';
import {
  DeleteDatabase,
  deleteDatabase,
} from '@/data/api/database/database.api';
import { CdbError } from '@/data/api/database';

interface UseDeleteDatabase {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useDeleteDatabase({ onError, onSuccess }: UseDeleteDatabase) {
  const mutation = useMutation({
    mutationFn: (databaseInfo: DeleteDatabase) => {
      return deleteDatabase(databaseInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteDatabase: (databaseInfo: DeleteDatabase) => {
      return mutation.mutate(databaseInfo);
    },
    ...mutation,
  };
}
