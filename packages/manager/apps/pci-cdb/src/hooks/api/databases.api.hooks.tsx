import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import { getServiceDatabases } from '@/data/cdb/databases';

export function useGetDatabases(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: QueryObserverOptions = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'database'];
  return useQuery({
    queryKey,
    queryFn: () => getServiceDatabases(projectId, engine, serviceId),
    ...options,
  }) as UseQueryResult<database.service.Database[], Error>;
}
