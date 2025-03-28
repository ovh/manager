export const getOfficeParentTenantQueryKey = (serviceName: string) => [
  'get',
  'license',
  'officePrepaid',
  serviceName,
  'parentTenant',
];
