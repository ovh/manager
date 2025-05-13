import { useQuery } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getMetrics } from '@/data/api/database/metric.api';

export function useGetMetrics(
  projectId: string,
  startTime: string,
  endTime: string,
) {
  const queryKey = ['metrics', projectId, startTime, endTime];

  return useQuery<database.metric.MetricData, Error>({
    queryKey,
    queryFn: () => getMetrics({ projectId, startTime, endTime }),
  });
}
