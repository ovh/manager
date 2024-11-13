const vcdBaseKey = 'vmwareCloudDirector';
const vdcBaseKey = 'virtualDataCenter';
const veeamBackupBaseKey = 'backup';
export const icebergListingQueryKey = 'servicesListingIceberg';

// Veeam Backup
export const veeamBackupListQueryKey = [vcdBaseKey, veeamBackupBaseKey];
export const getVeeamBackupQueryKey = (id: string) => [
  ...veeamBackupListQueryKey,
  id,
];
export const veeamBackupCatalogQueryKey = [veeamBackupBaseKey, 'catalog'];

// VCD organizations
export const vcdOrganizationListQueryKey = [vcdBaseKey, 'organizations'];
export const getVcdOrganizationQueryKey = (id: string) => [
  ...vcdOrganizationListQueryKey,
  id,
];
export const getVcdOrganizationBackupQueryKey = (id: string) => [
  ...getVcdOrganizationQueryKey(id),
  'backup',
];
export const getVcdOrganizationResetPasswordQueryKey = (id: string) => [
  ...getVcdOrganizationQueryKey(id),
  'resetPassword',
];
export const getVcdCatalogQueryKey = (serviceName: string) => [
  'order',
  'cartServiceOption',
  vcdBaseKey,
  serviceName,
];

// VCD organization virtualDataCenters
export const getVcdDatacentreListQueryKey = (id: string) => [
  ...getVcdOrganizationQueryKey(id),
  vdcBaseKey,
];
export const getVcdDatacentreQueryKey = (id: string, vdcId: string) => [
  ...getVcdDatacentreListQueryKey(id),
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
  ...getVcdOrganizationQueryKey(id),
];
export const updateVdcDetailsMutationKey = (vdcId: string) => [
  'put',
  ...getVdcQueryKey(vdcId),
];
