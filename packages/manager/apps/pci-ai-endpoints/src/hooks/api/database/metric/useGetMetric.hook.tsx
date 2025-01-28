import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getMetric } from '@/data/api/database/metric.api';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

export function useGetMetric(
  projectId: string,
  metric: string,
  startTime: string,
  endTime: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, metric, startTime, endTime];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getMetric({ projectId, metric, startTime, endTime }),
    ...options,
  }) as UseQueryResult<database.metric.MetricData, Error>;
}
