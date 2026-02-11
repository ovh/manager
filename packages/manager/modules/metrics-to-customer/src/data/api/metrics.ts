import apiClient from '@ovh-ux/manager-core-api';

import { fetchPrometheusData as requestMetricData } from '@/data/api/metricsClient';
import {
  ObservabilityMetricDataParams,
  ObservabilityMetricKindParams,
  ObservabilityMetricKindsParams,
  ObservabilityServiceParams,
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
  metricToken: string,
): Promise<MetricData<TData>> {
  const { query, start, end, step } = payload;

  const metricResult = await requestMetricData({
    query,
    start,
    end,
    step,
    metricToken,
  });

  return buildChartData<TData>(metricResult);
}

export const getMetricToken = async ({}: ObservabilityServiceParams): Promise<string> => {  
  const url = `/auth/token/observability`;
  const { data } = await apiClient.v6.post<{token: string}>(url);  
  return data.token;
};
