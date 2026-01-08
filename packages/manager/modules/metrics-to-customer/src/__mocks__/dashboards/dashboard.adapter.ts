import { getPredefinedDashboard as getPredefinedDashboardFromMock } from '@/__mocks__/dashboards/dashboard.mock';
import { apiConfig } from '@/__mocks__/mock.config';
import { getPredefinedDashboard as getPredefinedDashboardFromApi } from '@/data/api/dashboard';
import { ObservabilityDashboardParams } from '@/types/ClientApi.type';
import { Dashboard } from '@/types/observability.type';

export const getPredefinedDashboard = async (
  params: ObservabilityDashboardParams,
): Promise<Dashboard> => {
  const isMockEnabled = apiConfig.dashboards === 'mock';
  console.info('[MOCK-ADAPTER][getPredefinedDashboard] Mock enabled -> ', isMockEnabled);
  return isMockEnabled
    ? getPredefinedDashboardFromMock(params)
    : getPredefinedDashboardFromApi(params);
};
