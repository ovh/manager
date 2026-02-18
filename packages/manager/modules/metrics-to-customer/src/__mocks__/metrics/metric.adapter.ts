import {  
  getMetricKind as getMetricKindFromMock,
  getMetricKinds as getMetricKindsFromMock,  
} from '@/__mocks__/metrics/metric.mock';
import { apiConfig } from '@/__mocks__/mock.config';
import {  
  getMetricKindByName as getMetricKindFromApi,
  getMetricKinds as getMetricKindsFromApi,  
} from '@/data/api/metrics';
import {  
  ObservabilityMetricKindParams,
  ObservabilityMetricKindsParams,
} from '@/types/ClientApi.type';
import { Kind } from '@/types/observability.type';

export const getMetricKinds = async (params: ObservabilityMetricKindsParams): Promise<string[]> => {
  const isMockEnabled = apiConfig.metric === 'mock';
  console.info('[MOCK-ADAPTER][getMetricKinds] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getMetricKindsFromMock(params) : getMetricKindsFromApi(params);
};

export const getMetricKind = async (params: ObservabilityMetricKindParams): Promise<Kind> => {
  const isMockEnabled = apiConfig.metric === 'mock';
  console.info('[MOCK-ADAPTER][getMetricKind] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getMetricKindFromMock(params) : getMetricKindFromApi(params);
};
