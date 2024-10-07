const vcdBaseKey = 'vmwareCloudDirector';
const vdcBaseKey = 'virtualDataCenter';
export const icebergListingQueryKey = 'servicesListingIceberg';

// VCD organizations
export const getVcdOrganizationsQueryKey = () => [vcdBaseKey, 'organizations'];
export const getVcdOrganizationQueryKey = (id: string) => [
  ...getVcdOrganizationsQueryKey(),
  id,
];
export const getVcdOrganizationBackupQueryKey = (id: string) => [
  ...getVcdOrganizationQueryKey(id),
  'backup',
];
export const getVcdCatalogQueryKey = (serviceName: string) => [
  'order',
  'cartServiceOption',
  vcdBaseKey,
  serviceName,
];

// VCD Organization virtualDataCenters
export const getVcdDatacentresQueryKey = (id: string) => [
  ...getVcdOrganizationQueryKey(id),
  vdcBaseKey,
];
export const getVcdDatacentreQueryKey = (id: string, vdcId: string) => [
  ...getVcdDatacentresQueryKey(id),
  vdcId,
];

// VirtualDataCenter resources
const getVdcQueryKey = (vdcId: string) => [vdcBaseKey, vdcId];

export const getVdcComputeQueryKey = (vdcId: string) => [
  ...getVdcQueryKey(vdcId),
  'compute',
];
export const getVdcStorageQueryKey = (vdcId: string) => [
  ...getVdcQueryKey(vdcId),
  'storage',
];
export const getVdcOrderableResourceQueryKey = (vdcId: string) => [
  ...getVdcQueryKey(vdcId),
  'orderableResource',
];

// Mutation keys
export const updateVcdOrganizationDetailsMutationKey = (id: string) => [
  'put',
  getVcdOrganizationQueryKey(id),
];
export const updateVdcDetailsMutationKey = (vdcId: string) => [
  'put',
  getVdcQueryKey(vdcId),
];
