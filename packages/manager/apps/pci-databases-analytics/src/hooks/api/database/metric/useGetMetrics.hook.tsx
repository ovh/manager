import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
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
    ...options,
  }) as UseQueryResult<string[], Error>;
}
