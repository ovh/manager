import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import { getServiceLogs } from '@/api/databases/logs';

export function useGetServiceLogs(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'logs'];
  return useQuery({
    queryKey,
    queryFn: () => getServiceLogs({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.service.LogEntry[], Error>;
}
