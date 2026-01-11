export const getPredefinedDashboardQueryKey = (resourceName: string, productType: string) =>
  ['predefinedDashboard', 'resourceName', resourceName, 'productType', productType] as const;

export default getPredefinedDashboardQueryKey;
