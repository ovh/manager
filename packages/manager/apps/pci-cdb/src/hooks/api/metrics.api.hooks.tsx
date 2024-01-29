import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import { database } from '@/models/database';
import { getMetric } from '@/data/cdb/metrics';

export function useGetMetric(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  metric: string,
  period: database.service.MetricPeriodEnum,
  options: QueryObserverOptions = {},
) {
  const queryKey = [
    projectId,
    'database',
    engine,
    serviceId,
    'metric',
    metric,
    period,
  ];
  return useQuery({
    queryKey,
    queryFn: () => getMetric(projectId, engine, serviceId, metric, period),
    ...options,
  }) as UseQueryResult<database.service.Metric, Error>;
}
