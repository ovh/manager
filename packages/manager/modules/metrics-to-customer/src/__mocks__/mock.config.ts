export type ApiConfigMode = 'mock' | 'api';
export type ApiEndpoint = 'dashboards' | 'metric' | 'metric-token' | 'metrics-for-manager';

export const apiConfig: Record<ApiEndpoint, ApiConfigMode> = {
  dashboards: 'mock',
  metric: 'mock',
  'metric-token': 'mock',
  'metrics-for-manager': 'api',
};
