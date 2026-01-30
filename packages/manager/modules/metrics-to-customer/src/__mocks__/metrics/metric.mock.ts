import { getDataset } from '@/__datasets__/datasetsUtils';

import {  
  ObservabilityMetricKindParams,
  ObservabilityMetricKindsParams,
  ObservabilityServiceParams,
} from '@/types/ClientApi.type';
import { Kind } from '@/types/observability.type';

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

export const getMetricToken = async (params: ObservabilityServiceParams): Promise<string> => {  
  console.info(`[MOCK-ADAPTER][getMetricToken] from url param for the resource ${params.resourceName} -> `);

  const metricToken = window.localStorage.getItem('metric-token') ?? '';

  return Promise.resolve(metricToken);
};
