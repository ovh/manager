import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import { getConnectionPools } from '@/data/api/database/connectionPool.api';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';
import { database } from '@/interfaces/database';

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
