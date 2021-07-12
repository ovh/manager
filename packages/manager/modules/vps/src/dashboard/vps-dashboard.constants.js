export const DASHBOARD_FEATURES = {
  autorenew: 'autorenew',
  rebuild: 'rebuild',
  reinstall: 'reinstall',
  status: 'status',
  summary: 'summary',
  upgrade: 'upgrade',
};
export const SERVICE_TYPE = 'vps';

export const NEW_RANGE_VERSION = '2019v1';
export const VPS_2014_AUTO_MIGRATION_DATE = '18/07/2020';

export const VPS_STATES = {
  ERROR: ['maintenance', 'stopped', 'stopping'],
  WARNING: ['backuping', 'installing', 'rebooting', 'upgrading'],
  SUCCESS: ['running'],
};

const COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA = {
  campaignId: '[commit-recommit]',
  creation: '[batch1]',
  format: '[link]',
  generalPlacement: '[vps]',
  detailedPlacement: '[commitment]',
};

export const COMMIT_IMPRESSION_TRACKING_DATA = {
  ...COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA,
  variant: '[commit]',
};

export const RECOMMIT_IMPRESSION_TRACKING_DATA = {
  ...COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA,
  variant: '[recommit]',
};

export const VPS_MIGRATION_AVAILABLE_STATUS = 'available';

export default {
  DASHBOARD_FEATURES,
  NEW_RANGE_VERSION,
  SERVICE_TYPE,
  VPS_MIGRATION_AVAILABLE_STATUS,
  VPS_STATES,
};
