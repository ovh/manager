export const subRoutes = {
  onboarding: 'onboarding',
  dashboard: ':id',
  order: 'order',
  delete: 'delete',
  editName: 'edit-name',
  editDescription: 'edit-description',
  vdcId: ':vdcId',
  virtualDatacenters: 'virtual-datacenters',
  datacentreStorage: 'storage',
  datacentreCompute: 'compute',
  resetPassword: 'reset-password',
  vrackSegment: 'vrack-segments',
  vrackSegmentId: ':vrackSegmentId',
  vrackNetwork: 'vrack-networks',
  vrackNetworkId: ':vrackNetworkId',
} as const;

export const urls = {
  root: '/',
  listing: '/',
  onboarding: `/${subRoutes.onboarding}`,
  dashboard: `/${subRoutes.dashboard}`,
  resetPassword: `/${subRoutes.dashboard}/${subRoutes.resetPassword}`,
  editName: `/${subRoutes.dashboard}/${subRoutes.editName}`,
  editDescription: `/${subRoutes.dashboard}/${subRoutes.editDescription}`,
  datacentres: `/${subRoutes.dashboard}/${subRoutes.virtualDatacenters}`,
  datacentreDashboard: `/${subRoutes.dashboard}/${subRoutes.virtualDatacenters}/${subRoutes.vdcId}`,
  datacentreEditDescription: `/${subRoutes.dashboard}/${subRoutes.virtualDatacenters}/${subRoutes.vdcId}/${subRoutes.editDescription}`,
  datacentreStorage: `/${subRoutes.dashboard}/${subRoutes.virtualDatacenters}/${subRoutes.vdcId}/${subRoutes.datacentreStorage}`,
  datacentreStorageOrder: `/${subRoutes.dashboard}/${subRoutes.virtualDatacenters}/${subRoutes.vdcId}/${subRoutes.datacentreStorage}/${subRoutes.order}`,
  datacentreCompute: `/${subRoutes.dashboard}/${subRoutes.virtualDatacenters}/${subRoutes.vdcId}/${subRoutes.datacentreCompute}`,
  datacentreComputeOrder: `/${subRoutes.dashboard}/${subRoutes.virtualDatacenters}/${subRoutes.vdcId}/${subRoutes.datacentreCompute}/${subRoutes.order}`,
  vrackSegment: `/${subRoutes.dashboard}/${subRoutes.virtualDatacenters}/${subRoutes.vdcId}/${subRoutes.vrackSegment}`,
  vrackSegmentEditVlanId: `/${subRoutes.dashboard}/${subRoutes.virtualDatacenters}/${subRoutes.vdcId}/${subRoutes.vrackSegment}/${subRoutes.vrackSegmentId}/edit`,
  vrackSegmentDeleteNetwork: `/${subRoutes.dashboard}/${subRoutes.virtualDatacenters}/${subRoutes.vdcId}/${subRoutes.vrackSegment}/${subRoutes.vrackSegmentId}/${subRoutes.vrackNetwork}/${subRoutes.vrackNetworkId}/delete`,
} as const;

export const veeamBackupAppName = 'veeam-backup';
