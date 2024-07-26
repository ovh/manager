import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getServiceLogs } from '@/data/api/database/logs.api';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

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
