import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { database } from '@/models/database';
import { getServiceLogs } from '@/api/databases/logs';
import { useQueryImmediateRefetch } from './useImmediateRefetch';

export function useGetServiceLogs(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'logs'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getServiceLogs({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.service.LogEntry[], Error>;
}
