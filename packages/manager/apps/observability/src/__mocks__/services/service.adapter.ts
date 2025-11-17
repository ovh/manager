import { apiConfig } from '@/__mocks__/mock.config';
import { getObservabilityServices as getObservabilityServicesFromMock } from '@/__mocks__/services/service.mock';
import { getObservabilityServices as getObservabilityServicesFromApi } from '@/data/api/observability.api';
import { ObservabilityService } from '@/types/observability.type';

export const getObservabilityServices = async (
  signal: AbortSignal,
): Promise<ObservabilityService[]> => {
  const isMockEnabled = apiConfig.service === 'mock';
  console.info('[MOCK-ADAPTER][getObservabilityServices] Mock enabled -> ', isMockEnabled);
  return isMockEnabled
    ? getObservabilityServicesFromMock(signal)
    : getObservabilityServicesFromApi(signal);
};
