import { useQuery, QueryObserverOptions } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getMetric } from '@/data/api/database/metric.api';

export function useGetMetric(
  projectId: string,
  metric: string,
  startTime: string,
  endTime: string,
  options: Partial<QueryObserverOptions> = {},
) {
  const queryKey = ['metrics', projectId, metric, startTime, endTime];

  return useQuery<database.metric.MetricData, Error>({
    queryKey,
    queryFn: () => getMetric({ projectId, metric, startTime, endTime }),
    ...options,
  });
}
