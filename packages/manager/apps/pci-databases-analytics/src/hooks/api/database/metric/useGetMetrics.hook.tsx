import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import { database } from '@/interfaces/database';
import { getMetrics } from '@/data/api/database/metric.api';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

export function useGetMetrics(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'metric'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getMetrics({ projectId, engine, serviceId }),
    options,
  }) as UseQueryResult<string[], Error>;
}
