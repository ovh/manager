import apiClient from '@ovh-ux/manager-core-api';

import {
  ObservabilityMetricDataParams,
  ObservabilityMetricKindParams,
  ObservabilityMetricKindsParams,
} from '../../types/ClientApi.type';
import { Kind, MetricData } from '../../types/observability.type';
import { PrometheusResult, fetchPrometheusData } from './prometheusClient';

export const getMetricKinds = async ({
  resourceName,
  signal,
}: ObservabilityMetricKindsParams): Promise<string[]> => {
  const url = `/observability/resource/${resourceName}/metric/kind`;
  const { data } = await apiClient.v2.get<string[]>(url, {
    signal,
  });
  return data;
};

export const getMetricKindByName = async ({
  resourceName,
  kindName,
  signal,
}: ObservabilityMetricKindParams): Promise<Kind> => {
  const url = `/observability/resource/${resourceName}/metric/kind/${kindName}`;
  const { data } = await apiClient.v2.get<Kind>(url, {
    signal,
  });
  return data;
};

export async function fetchChartData<TData>(
  payload: ObservabilityMetricDataParams,
): Promise<MetricData<TData>> {
  const { query, start, end, step } = payload;

  const result: PrometheusResult = await fetchPrometheusData({
    query,
    start,
    end,
    step,
  });

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

  return Promise.resolve(data);
}
