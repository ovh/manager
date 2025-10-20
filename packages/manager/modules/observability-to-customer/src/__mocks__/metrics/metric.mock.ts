import { getDataset } from '../../__datasets__/datasetsUtils';
import { ChartData } from '../../components/charts/base';
import { ObservabilityMetricDataParams } from '../../types/ClientApi.type';
import { MetricData } from '../../types/observability.type';

export const fetchChartData = async <TData>(
  params: ObservabilityMetricDataParams,
): Promise<MetricData<TData>> => {
  console.info(`[MOCK-ADAPTER][fetchChartData] mock for service ${params.query} -> `);

  const data: ChartData<TData> = getDataset('metrics/prometheus', params.query);

  return Promise.resolve(data);
};
