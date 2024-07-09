import {
  QueryObserverOptions,
  UseQueryResult,
  useMutation,
} from '@tanstack/react-query';

import {
  AddConnectionPoolProps,
  DeleteConnectionPoolProps,
  EditConnectionPoolProps,
  addConnectionPool,
  deleteConnectionPool,
  editConnectionPool,
  getConnectionPools,
} from '@/data/api/databases/connectionPool';
import { useQueryImmediateRefetch } from './useImmediateRefetch';
import { database } from '@/interfaces/database';
import { CdbError } from '@/data/api/databases';

export function useGetConnectionPools(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'connectionPool'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getConnectionPools({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.postgresql.ConnectionPool[], Error>;
}

export interface MutateConnectionPoolProps {
  onError: (cause: CdbError) => void;
  onSuccess: (connectionPool: database.postgresql.ConnectionPool) => void;
}
export function useAddConnectionPool({
  onError,
  onSuccess,
}: MutateConnectionPoolProps) {
  const mutation = useMutation({
    mutationFn: (cpInfo: AddConnectionPoolProps) => {
      return addConnectionPool(cpInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addConnectionPool: (cpInfo: AddConnectionPoolProps) => {
      return mutation.mutate(cpInfo);
    },
    ...mutation,
  };
}

export function useEditConnectionPool({
  onError,
  onSuccess,
}: MutateConnectionPoolProps) {
  const mutation = useMutation({
    mutationFn: (cpInfo: EditConnectionPoolProps) => {
      return editConnectionPool(cpInfo);
    },
    onError,
    onSuccess,
  });

  return {
    editConnectionPool: (cpInfo: EditConnectionPoolProps) => {
      return mutation.mutate(cpInfo);
    },
    ...mutation,
  };
}

interface UseDeleteConnectionPoolProps {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}

export function useDeleteConnectionPool({
  onError,
  onSuccess,
}: UseDeleteConnectionPoolProps) {
  const mutation = useMutation({
    mutationFn: (connectionPoolInfo: DeleteConnectionPoolProps) => {
      return deleteConnectionPool(connectionPoolInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteConnectionPool: (connectionPoolInfo: DeleteConnectionPoolProps) => {
      return mutation.mutate(connectionPoolInfo);
    },
    ...mutation,
  };
}
