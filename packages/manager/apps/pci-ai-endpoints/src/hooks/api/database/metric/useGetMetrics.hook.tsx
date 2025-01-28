import { UseQueryResult } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { getMetrics } from '@/data/api/database/metric.api';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

export function useGetMetrics(
  projectId: string,
  startTime: string,
  endTime: string,
) {
  const queryKey = [projectId, startTime, endTime];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getMetrics({ projectId, startTime, endTime }),
  }) as UseQueryResult<database.metric.MetricData, Error>;
}
