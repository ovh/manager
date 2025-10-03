import * as database from '@/types/cloud/project/database';
import { getMetric } from '@/data/api/database/metric.api';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';

export function useGetMetric(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  metric: string,
  period: database.service.MetricPeriodEnum,
  options?: OptionsFor<typeof getMetric>,
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
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getMetric({ projectId, engine, serviceId, metric, period }),
    ...options,
  });
}
