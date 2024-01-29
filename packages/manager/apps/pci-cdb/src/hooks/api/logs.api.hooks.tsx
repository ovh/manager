import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import { getServiceLogs } from '@/data/cdb/logs';

export function useGetServiceLogs(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: QueryObserverOptions = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'logs'];
  return useQuery({
    queryKey,
    queryFn: () => getServiceLogs(projectId, engine, serviceId),
    ...options,
  }) as UseQueryResult<database.service.LogEntry[], Error>;
}
