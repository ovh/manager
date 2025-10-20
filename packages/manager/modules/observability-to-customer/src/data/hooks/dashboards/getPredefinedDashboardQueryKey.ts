export const getPredefinedDashboardQueryKey = (serviceName: string, productType: string) =>
  ['predefinedDashboard', 'serviceName', serviceName, 'productType', productType] as const;
