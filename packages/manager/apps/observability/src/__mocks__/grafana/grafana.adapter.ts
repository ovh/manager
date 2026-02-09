import { getGrafanas as getGrafanasFromMock } from '@/__mocks__/grafana/grafana.mock';
import { apiConfig } from '@/__mocks__/mock.config';
import { getGrafanas as getGrafanasFromApi } from '@/data/api/grafana.api';
import { ObservabilityServiceParams } from '@/data/api/observability.props';
import { Grafana } from '@/types/managedDashboards.type';

export const getGrafanas = async (params: ObservabilityServiceParams): Promise<Grafana[]> => {
  const isMockEnabled = apiConfig.grafana === 'mock';
  console.info('[MOCK-ADAPTER][getGrafanas] Mock enabled -> ', isMockEnabled);
  return isMockEnabled ? getGrafanasFromMock(params) : getGrafanasFromApi(params);
};
