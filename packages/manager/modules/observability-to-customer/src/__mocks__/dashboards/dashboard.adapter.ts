import { getPredefinedDashboard as getPredefinedDashboardFromApi } from '../../data/api/dashboard';
import { ObservabilityDashboardParams } from '../../types/ClientApi.type';
import { Dashboard } from '../../types/observability.type';
import { getPredefinedDashboard as getPredefinedDashboardFromMock } from '../dashboards/dashboard.mock';
import { apiConfig } from '../mock.config';

export const getPredefinedDashboard = async (
  params: ObservabilityDashboardParams,
): Promise<Dashboard> => {
  const isMockEnabled = apiConfig.mode === 'mock';
  console.info('[MOCK-ADAPTER][getPredefinedDashboard] Mock enabled -> ', isMockEnabled);
  return isMockEnabled
    ? getPredefinedDashboardFromMock(params)
    : getPredefinedDashboardFromApi(params);
};
