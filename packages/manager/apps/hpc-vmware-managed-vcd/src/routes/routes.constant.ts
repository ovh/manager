export const subRoutes = {
  onboarding: 'onboarding',
  dashboard: ':id',
  order: 'order',
  editName: 'edit-name',
  editDescription: 'edit-description',
  vdcId: ':vdcId',
  datacentres: 'datacentres',
  datacentreStorage: 'storage',
  datacentreCompute: 'compute',
};

export const urls = {
  root: '/',
  listing: '/',
  onboarding: `/${subRoutes.onboarding}`,
  dashboard: `/${subRoutes.dashboard}`,
  editName: `/${subRoutes.dashboard}/${subRoutes.editName}`,
  editDescription: `/${subRoutes.dashboard}/${subRoutes.editDescription}`,
  datacentres: `/${subRoutes.dashboard}/${subRoutes.datacentres}`,
  datacentreDashboard: `/${subRoutes.dashboard}/${subRoutes.datacentres}/${subRoutes.vdcId}`,
  datacentreEditDescription: `/${subRoutes.dashboard}/${subRoutes.datacentres}/${subRoutes.vdcId}/${subRoutes.editDescription}`,
  datacentreStorage: `/${subRoutes.dashboard}/${subRoutes.datacentres}/${subRoutes.vdcId}/${subRoutes.datacentreStorage}`,
  datacentreStorageOrder: `/${subRoutes.dashboard}/${subRoutes.datacentres}/${subRoutes.vdcId}/${subRoutes.datacentreStorage}/${subRoutes.order}`,
  datacentreCompute: `/${subRoutes.dashboard}/${subRoutes.datacentres}/${subRoutes.vdcId}/${subRoutes.datacentreCompute}`,
  datacentreComputeOrder: `/${subRoutes.dashboard}/${subRoutes.datacentres}/${subRoutes.vdcId}/${subRoutes.datacentreCompute}/${subRoutes.order}`,
};

export const veeamBackupAppName = 'veeam-backup';
