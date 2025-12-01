export type ApiConfigMode = 'mock' | 'api';
export type ApiEndpoint = 'tenant' | 'service' | 'infrastructure' | 'grafana' | 'log' | 'metric';

export const apiConfig: Record<ApiEndpoint, ApiConfigMode> = {
  tenant: 'api',
  service: 'api',
  infrastructure: 'api',
  grafana: 'mock',
  log: 'mock',
  metric: 'mock',
};
