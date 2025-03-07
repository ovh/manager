import { useMemo, useCallback } from 'react';
import { HostMetric } from '@/types/cloud/project/database/metric';

const useCalculateTotals = (metrics: HostMetric[]) => {
  const aggregateMetric = useCallback(
    (unit: string) =>
      metrics
        .filter((metric) => metric.unit === unit)
        .flatMap((metric) => metric.data)
        .reduce((sum, entry) => sum + entry.value, 0),
    [metrics],
  );

  const { totalInputTokens, totalOutputTokens, totalSeconds } = useMemo(() => {
    return {
      totalInputTokens: aggregateMetric('input_tokens'),
      totalOutputTokens: aggregateMetric('output_tokens'),
      totalSeconds: aggregateMetric('seconds'),
    };
  }, [metrics, aggregateMetric]);

  return { totalInputTokens, totalOutputTokens, totalSeconds };
};

export default useCalculateTotals;
