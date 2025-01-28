import { useState, useEffect } from 'react';
import { HostMetric } from '@/types/cloud/project/database/metric';

const useCalculateTotals = (metrics: HostMetric[], start: Date, end: Date) => {
  const [totalInputTokens, setTotalInputTokens] = useState<number>(0);
  const [totalOutputTokens, setTotalOutputTokens] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);

  useEffect(() => {
    let inputTokens = 0;
    let outputTokens = 0;
    let seconds = 0;

    metrics.forEach((metric) => {
      if (metric.unit === 'input_tokens') {
        metric.data.forEach((entry) => {
          inputTokens += entry.value;
        });
      } else if (metric.unit === 'output_tokens') {
        metric.data.forEach((entry) => {
          outputTokens += entry.value;
        });
      } else if (metric.unit === 'seconds') {
        metric.data.forEach((entry) => {
          seconds += entry.value;
        });
      }
    });

    setTotalInputTokens(inputTokens);
    setTotalOutputTokens(outputTokens);
    setTotalSeconds(seconds);
  }, [metrics, start, end]);

  return { totalInputTokens, totalOutputTokens, totalSeconds };
};

export default useCalculateTotals;
