export type ApiConfigMode = 'mock' | 'api';
export type ApiEndpoint =
  | 'tenant'
  | 'tenantSubscription'
  | 'grafana'
  | 'dashboards'
  | 'metric'
  | 'metrics-for-manager';

export const apiConfig: Record<ApiEndpoint, ApiConfigMode> = {
  tenant: 'api',
  tenantSubscription: 'mock',
  grafana: 'mock',
  dashboards: 'mock',
  metric: 'mock',
  'metrics-for-manager': 'api',
};
