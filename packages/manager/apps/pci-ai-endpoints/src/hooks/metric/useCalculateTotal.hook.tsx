import { useMemo } from 'react';
import { HostMetric } from '@/types/cloud/project/database/metric';

const useCalculateTotals = (metrics: HostMetric[], start: Date, end: Date) => {
  const aggregateMetric = (unit: string) =>
    metrics
      .filter((metric) => metric.unit === unit)
      .flatMap((metric) => metric.data)
      .reduce((sum, entry) => sum + entry.value, 0);

  const { totalInputTokens, totalOutputTokens, totalSeconds } = useMemo(() => {
    return {
      totalInputTokens: aggregateMetric('input_tokens'),
      totalOutputTokens: aggregateMetric('output_tokens'),
      totalSeconds: aggregateMetric('seconds'),
    };
  }, [metrics, start, end]);

  return { totalInputTokens, totalOutputTokens, totalSeconds };
};

export default useCalculateTotals;
