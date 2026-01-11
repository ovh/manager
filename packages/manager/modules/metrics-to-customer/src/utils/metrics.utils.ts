import { PrometheusResult } from '@/data/api/metricsClient';
import { MetricData } from '@/types/observability.type';

// TODO: update the chart adapter when wired to the real metric APIs.
export function buildChartData<TData>(result: PrometheusResult): MetricData<TData> {
  const series = result?.data?.result ?? [];

  if (series.length === 0) return [];

  const keys = ['value', 'value1', 'value2', 'value3'];
  const seriesKeys = keys.slice(0, series.length);

  const timestamps = series[0]?.values?.map(([ts]) => Number(ts) * 1000) ?? [];

  const data: TData[] = timestamps.map((timestamp, index) => {
    const entry: { [key: string]: number } = { timestamp };

    series.forEach((serie, serieIndex) => {
      const key = seriesKeys[serieIndex] as string;
      const value = serie?.values?.[index]?.[1];
      entry[key] = value !== undefined ? Number(value) : 0;
    });

    return entry as TData;
  });

  return data;
}

// TODO: Extend this helper to support more generic variable replacements in queries, not just <resource_urn>.
export function buildQueryWithResourceUrn(query: string, resourceUrn: string): string {
  return query.replace('<resource_urn>', `"${resourceUrn}"`);
}
