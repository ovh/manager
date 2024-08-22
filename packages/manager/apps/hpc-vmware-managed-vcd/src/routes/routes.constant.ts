export const urlParts = {
  onboarding: 'onboarding',
  dashboard: ':id',
  editName: 'edit-name',
  editDesc: 'edit-desc',
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
  editDesc: `/${urlParts.dashboard}/${urlParts.editDesc}`,
  datacentres: `/${urlParts.dashboard}/${urlParts.datacentres}`,
  datacentreDashboard: `/${urlParts.dashboard}/${urlParts.datacentres}/${urlParts.vdcId}`,
  datacentreStorage: `/${urlParts.dashboard}/${urlParts.datacentres}/${urlParts.vdcId}/${urlParts.datacentreStorage}`,
  datacentreCompute: `/${urlParts.dashboard}/${urlParts.datacentres}/${urlParts.vdcId}/${urlParts.datacentreCompute}`,
};
