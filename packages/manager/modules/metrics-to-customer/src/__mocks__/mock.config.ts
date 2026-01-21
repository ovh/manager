export type ApiConfigMode = 'mock' | 'api';
export type ApiEndpoint =
  | 'tenant'
  | 'tenantSubscription'
  | 'grafana'
  | 'dashboards'
  | 'metric'
  | 'metric-token'
  | 'metrics-for-manager';

export const apiConfig: Record<ApiEndpoint, ApiConfigMode> = {
  tenant: 'api',
  tenantSubscription: 'mock',
  grafana: 'mock',
  dashboards: 'mock',
  metric: 'mock',
  'metric-token': 'mock',
  'metrics-for-manager': 'api',
};
