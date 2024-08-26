export const urlParts = {
  onboarding: 'onboarding',
  dashboard: ':id',
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
  onboarding: `/${urlParts.onboarding}`,
  dashboard: `/${urlParts.dashboard}`,
  editName: `/${urlParts.dashboard}/${urlParts.editName}`,
  editDescription: `/${urlParts.dashboard}/${urlParts.editDescription}`,
  datacentres: `/${urlParts.dashboard}/${urlParts.datacentres}`,
  datacentreDashboard: `/${urlParts.dashboard}/${urlParts.datacentres}/${urlParts.vdcId}`,
  datacentreEditDescription: `/${urlParts.dashboard}/${urlParts.datacentres}/${urlParts.vdcId}/${urlParts.editDescription}`,
  datacentreStorage: `/${urlParts.dashboard}/${urlParts.datacentres}/${urlParts.vdcId}/${urlParts.datacentreStorage}`,
  datacentreCompute: `/${urlParts.dashboard}/${urlParts.datacentres}/${urlParts.vdcId}/${urlParts.datacentreCompute}`,
};
