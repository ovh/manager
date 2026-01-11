import {
  fetchChartData as fetchChartDataFromMock,  
} from '@/__mocks__/metrics-for-manager/metrics-for-manager.mock';
import { apiConfig } from '@/__mocks__/mock.config';
import {
  fetchChartData as fetchChartDataFromApi,
} from '@/data/api/metrics';
import {
  ObservabilityMetricDataParams,  
} from '@/types/ClientApi.type';
import { MetricData } from '@/types/observability.type';

export const fetchChartData = async <TData>(
  params: ObservabilityMetricDataParams,
  metricToken: string,
): Promise<MetricData<TData>> => {
  const isMockEnabled = apiConfig['metrics-for-manager'] === 'mock';
  console.info('[MOCK-ADAPTER][fetchChartData] Mock enabled -> ', isMockEnabled);
  return isMockEnabled
    ? fetchChartDataFromMock<TData>(params)
    : fetchChartDataFromApi<TData>(params, metricToken);
};
