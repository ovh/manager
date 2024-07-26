import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import { getServiceDatabases } from '@/data/api/database/database.api';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

export function useGetDatabases(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'database'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getServiceDatabases({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.service.Database[], Error>;
}
