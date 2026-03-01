import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { AddDatabase, addDatabase } from '@/data/api/database/database.api';
import { CdbError } from '@/data/api/database';

interface UseAddDatabase {
  onError: (cause: CdbError) => void;
  onSuccess: (database: database.service.Database) => void;
}
export function useAddDatabase({
  onError,
  onSuccess: customOnSuccess,
}: UseAddDatabase) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (databaseInfo: AddDatabase) => {
      return addDatabase(databaseInfo);
    },
    onError,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          variables.projectId,
          'database',
          variables.engine,
          variables.serviceId,
          'database',
        ],
      });
      customOnSuccess(data);
    },
  });

  return {
    addDatabase: (databaseInfo: AddDatabase) => {
      return mutation.mutate(databaseInfo);
    },
    ...mutation,
  };
}
