import {
  fetchChartData as fetchChartDataFromMock,
  getMetricKind as getMetricKindFromMock,
  getMetricKinds as getMetricKindsFromMock,
} from '@/__mocks__/metrics/metric.mock';
import { apiConfig } from '@/__mocks__/mock.config';
import {
  fetchChartData as fetchChartDataFromApi,
  getMetricKindByName as getMetricKindFromApi,
  getMetricKinds as getMetricKindsFromApi,
} from '@/data/api/metrics';
import {
  ObservabilityMetricDataParams,
  ObservabilityMetricKindParams,
  ObservabilityMetricKindsParams,
} from '@/types/ClientApi.type';
import { Kind, MetricData } from '@/types/observability.type';

export const fetchChartData = async <TData>(
  params: ObservabilityMetricDataParams,
): Promise<MetricData<TData>> => {
  const isMockEnabled = apiConfig.mode === 'mock';
  console.info('[MOCK-ADAPTER][fetchChartData] Mock enabled -> ', isMockEnabled);
  return isMockEnabled
    ? fetchChartDataFromMock<TData>(params)
    : fetchChartDataFromApi<TData>(params);
};

export const getMetricKinds = async (params: ObservabilityMetricKindsParams): Promise<string[]> => {
  const isMockEnabled = apiConfig.mode === 'mock';
  console.info('[MOCK-ADAPTER][getMetricKinds] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getMetricKindsFromMock(params) : getMetricKindsFromApi(params);
};

export const getMetricKind = async (params: ObservabilityMetricKindParams): Promise<Kind> => {
  const isMockEnabled = apiConfig.mode === 'mock';
  console.info('[MOCK-ADAPTER][getMetricKind] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getMetricKindFromMock(params) : getMetricKindFromApi(params);
};
