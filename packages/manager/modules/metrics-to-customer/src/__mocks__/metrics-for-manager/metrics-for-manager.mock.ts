import { getDataset } from '@/__datasets__/datasetsUtils';

import { MetricData } from '@/types/observability.type';
import { ChartData } from '@/types/charts/base/Chart.type';
import { ObservabilityMetricDataParams } from '@/types/ClientApi.type';

export const fetchChartData = async <TData>(
  params: ObservabilityMetricDataParams,  
): Promise<MetricData<TData>> => {
  console.info(`[MOCK-ADAPTER][fetchChartData] mock for resource ${params.query} -> `);

  const data: ChartData<TData> = getDataset('metrics-for-manager/prometheus', params.query) as ChartData<TData>;

  return Promise.resolve(data);
};
