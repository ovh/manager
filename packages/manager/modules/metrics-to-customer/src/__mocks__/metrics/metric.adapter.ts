import {  
  getMetricKind as getMetricKindFromMock,
  getMetricKinds as getMetricKindsFromMock,
  getMetricToken as getMetricTokenFromMock,
} from '@/__mocks__/metrics/metric.mock';
import { apiConfig } from '@/__mocks__/mock.config';
import {  
  getMetricKindByName as getMetricKindFromApi,
  getMetricKinds as getMetricKindsFromApi,
  getMetricToken as getMetricTokenFromApi,
} from '@/data/api/metrics';
import {  
  ObservabilityMetricKindParams,
  ObservabilityMetricKindsParams,
  ObservabilityServiceParams,
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

export const getMetricToken = async (
  params: ObservabilityServiceParams,
): Promise<string> => {
  const isMockEnabled = apiConfig['metric-token'] === 'mock';
  console.info('[MOCK-ADAPTER][getMetricToken] Mock enabled -> ', isMockEnabled);
  return isMockEnabled
    ? getMetricTokenFromMock(params)
    : getMetricTokenFromApi(params);
};
