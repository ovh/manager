import { fetchChartData as fetchChartDataFromApi } from '../../data/api/metrics';
import { ObservabilityMetricDataParams } from '../../types/ClientApi.type';
import { MetricData } from '../../types/observability.type';
import { fetchChartData as fetchChartDataFromMock } from '../metrics/metric.mock';
import { apiConfig } from '../mock.config';

export const fetchChartData = async <TData>(
  params: ObservabilityMetricDataParams,
): Promise<MetricData<TData>> => {
  const isMockEnabled = apiConfig.mode === 'mock';
  console.info('[MOCK-ADAPTER][fetchChartData] Mock enabled -> ', isMockEnabled);
  return isMockEnabled
    ? fetchChartDataFromMock<TData>(params)
    : fetchChartDataFromApi<TData>(params);
};
