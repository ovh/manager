import { REGIONS_AVAILABLES } from '@/MetricsToCustomer.constants';
import { PrometheusResult } from '@/data/api/metricsClient';
import { MetricData } from '@/types/observability.type';
import { Region } from '@/types/region.type';

/**
 * Determines if metric data should be fetched based on region availability
 * @param regions - Array of regions to check
 * @returns true if at least one region supports metric data, false otherwise
 */
export const isRegionAvailable = (regions: Region[]): boolean => {
  return regions.some((region) => REGIONS_AVAILABLES.includes(region.code ?? ''));
};

// TODO: update the chart adapter when wired to the real metric APIs.
export function buildChartData<TData>(result: PrometheusResult): MetricData<TData> {
  const series = result?.data?.result ?? [];

  if (series.length === 0) return [];

  const timestamps = series[0]?.values?.map(([ts]) => Number(ts) * 1000) ?? [];

  const data: TData[] = timestamps.map((timestamp, index) => {
    const entry: { [key: string]: number } = { timestamp };

    series.forEach((serie, serieIndex) => {
      const key = serieIndex === 0 ? 'value' : `value${serieIndex}`;
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
