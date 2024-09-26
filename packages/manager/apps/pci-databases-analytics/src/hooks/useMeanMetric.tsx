import { useEffect, useState } from 'react';
import { QueryObserverOptions } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { useGetMetric } from '@/hooks/api/database/metric/useGetMetric.hook';

interface UseMeanMetricProps {
  projectId: string;
  engine: database.EngineEnum;
  serviceId: string;
  metric: string;
  period?: database.service.MetricPeriodEnum;
  fn?: (val: number) => number;
  options?: Omit<QueryObserverOptions, 'queryKey'>;
}
export function useMeanMetric({
  projectId,
  engine,
  serviceId,
  metric,
  period = database.service.MetricPeriodEnum.lastDay,
  fn = (val) => val,
  options = {},
}: UseMeanMetricProps) {
  const [mean, setMean] = useState<number | undefined>();
  const metricQuery = useGetMetric(
    projectId,
    engine,
    serviceId,
    metric,
    period,
    options,
  );
  useEffect(() => {
    if (metricQuery.data) {
      const computed =
        metricQuery.data.metrics.reduce(
          (acc, m) =>
            acc +
            m.dataPoints.reduce((sum, curr) => sum + fn(curr.value), 0) /
              m.dataPoints.length,
          0,
        ) / metricQuery.data.metrics.length;
      setMean(computed);
    }
  }, [metricQuery.data]);
  return mean;
}
