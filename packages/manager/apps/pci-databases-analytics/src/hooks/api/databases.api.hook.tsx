import {
  QueryObserverOptions,
  UseQueryResult,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import {
  AddDatabaseProps,
  DeleteDatabaseProps,
  addDatabase,
  deleteDatabase,
  getServiceDatabases,
} from '@/api/databases/databases';

export function useGetDatabases(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'database'];
  return useQuery({
    queryKey,
    queryFn: () => getServiceDatabases(projectId, engine, serviceId),
    ...options,
  }) as UseQueryResult<database.service.Database[], Error>;
}

interface MutateDatabaseProps {
  onError: (cause: Error) => void;
  onSuccess: (database: database.service.Database) => void;
}
export function useAddDatabase({ onError, onSuccess }: MutateDatabaseProps) {
  const mutation = useMutation({
    mutationFn: (databaseInfo: AddDatabaseProps) => {
      return addDatabase(databaseInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addDatabase: (databaseInfo: AddDatabaseProps) => {
      return mutation.mutate(databaseInfo);
    },
    ...mutation,
  };
}

interface UseDeleteDatabaseProps {
  onError: (cause: Error) => void;
  onSuccess: () => void;
}
export function useDeleteDatabase({
  onError,
  onSuccess,
}: UseDeleteDatabaseProps) {
  const mutation = useMutation({
    mutationFn: (databaseInfo: DeleteDatabaseProps) => {
      return deleteDatabase(databaseInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteDatabase: (databaseInfo: DeleteDatabaseProps) => {
      return mutation.mutate(databaseInfo);
    },
    ...mutation,
  };
}
