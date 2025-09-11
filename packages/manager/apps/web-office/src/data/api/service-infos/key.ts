export const getOfficeLicenseServiceInfosKey = (serviceName: string) => [
  'get',
  'license',
  'office',
  serviceName,
  'serviceInfos',
];

export const getOfficeLicenseServiceInfoTenantQueryKey = (serviceName: string) => [
  'get',
  'license',
  'officePrepaid',
  serviceName,
  'serviceInfos',
];
