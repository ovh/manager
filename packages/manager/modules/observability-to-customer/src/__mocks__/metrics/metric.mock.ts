import { getDataset } from '../../__datasets__/datasetsUtils';
import { ChartData } from '../../components/charts/base';
import {
  ObservabilityMetricDataParams,
  ObservabilityMetricKindParams,
  ObservabilityMetricKindsParams,
} from '../../types/ClientApi.type';
import { Kind, MetricData } from '../../types/observability.type';

export const fetchChartData = async <TData>(
  params: ObservabilityMetricDataParams,
): Promise<MetricData<TData>> => {
  console.info(`[MOCK-ADAPTER][fetchChartData] mock for resource ${params.query} -> `);

  const data: ChartData<TData> = getDataset('metrics/prometheus', params.query) as ChartData<TData>;

  return Promise.resolve(data);
};

export const getMetricKinds = async (params: ObservabilityMetricKindsParams): Promise<string[]> => {
  console.info(`[MOCK-ADAPTER][getMetricKinds] mock for resource ${params.productType} -> `);

  const data: string[] = getDataset('metrics/kinds', params.productType) as string[];

  return Promise.resolve(data);
};

export const getMetricKind = async (params: ObservabilityMetricKindParams): Promise<Kind> => {
  console.info(`[MOCK-ADAPTER][getMetricKind] mock for the kind ${params.kindName} -> `);

  const data: Kind = getDataset<Kind>('metrics/kinds', params.kindName) as Kind;

  return Promise.resolve(data);
};
