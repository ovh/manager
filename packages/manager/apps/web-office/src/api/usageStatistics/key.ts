export const getOfficeUsageStatisticsQueryKey = (serviceName: string) => [
  'get',
  'license',
  'office',
  serviceName,
  'usageStatistics',
];
export const getOfficeTenantUsageStatisticsQueryKey = (serviceName: string) => [
  'get',
  'license',
  'office',
  serviceName,
  'tenantUsageStatistics',
];
