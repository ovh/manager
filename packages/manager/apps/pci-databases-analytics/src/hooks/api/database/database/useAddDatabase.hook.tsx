import { useMutation } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { AddDatabase, addDatabase } from '@/data/api/database/database.api';
import { CdbError } from '@/data/api/database';

interface UseAddDatabase {
  onError: (cause: CdbError) => void;
  onSuccess: (database: database.service.Database) => void;
}
export function useAddDatabase({ onError, onSuccess }: UseAddDatabase) {
  const mutation = useMutation({
    mutationFn: (databaseInfo: AddDatabase) => {
      return addDatabase(databaseInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addDatabase: (databaseInfo: AddDatabase) => {
      return mutation.mutate(databaseInfo);
    },
    ...mutation,
  };
}
