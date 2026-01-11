import apiClient from '@ovh-ux/manager-core-api';

import { fetchPrometheusData as requestMetricData } from '@/data/api/prometheusClient';
import {
  ObservabilityMetricDataParams,
  ObservabilityMetricKindParams,
  ObservabilityMetricKindsParams,
} from '@/types/ClientApi.type';
import { Kind, MetricData } from '@/types/observability.type';
import { buildChartData } from '@/utils/metrics.utils';

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

  // TODO: replace with the real metric API call once available.
  const metricResult = await requestMetricData({
    query,
    start,
    end,
    step,
  });

  return buildChartData<TData>(metricResult);
}
