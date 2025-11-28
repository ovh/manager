export type ApiConfigMode = 'mock' | 'api';
export type ApiEndpoint = 'tenant' | 'service' | 'infrastructure' | 'grafana' | 'log' | 'metric';

export const apiConfig: Record<ApiEndpoint, ApiConfigMode> = {
  tenant: 'mock',
  service: 'api',
  infrastructure: 'mock', // FIXME : fix retentions first before unmocking
  grafana: 'mock',
  log: 'mock',
  metric: 'mock',
};
