export const DASHBOARD_FEATURES = {
  autorenew: 'autorenew',
  rebuild: 'rebuild',
  reinstall: 'reinstall',
  status: 'status',
  summary: 'summary',
  upgrade: 'upgrade',
};
export const SERVICE_TYPE = 'vps';

export const ADD_DOMAIN_LINK_SUFFIX_URL =
  'webcloud/#/webCloud/domain/select?selection=~()';
export const NEW_RANGE_VERSION = '2019v1';

export const VPS_STATES = {
  ERROR: ['maintenance', 'stopped', 'stopping'],
  WARNING: ['backuping', 'installing', 'rebooting', 'upgrading', 'rescued'],
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

export const MIGRATION_STATUS = {
  ONGOING: 'ongoing',
  PLANNED: 'planned',
  AVAILABLE: 'available',
};

export const VPS_RANGE_COMPARE_LINKS = {
  FR: 'https://www.ovhcloud.com/fr/vps/compare/',
  ES: 'https://www.ovhcloud.com/es-es/vps/compare/',
  DE: 'https://www.ovhcloud.com/de/vps/compare/',
  IE: 'https://www.ovhcloud.com/en-ie/vps/compare/',
  IT: 'https://www.ovhcloud.com/it/vps/compare/',
  NL: 'https://www.ovhcloud.com/nl/vps/compare/',
  PL: 'https://www.ovhcloud.com/pl/vps/compare/',
  PT: 'https://www.ovhcloud.com/pt/vps/compare/',
  UK: 'https://www.ovhcloud.com/en-gb/vps/compare/',
  CA: 'https://www.ovhcloud.com/en-ca/vps/compare/',
  QC: 'https://www.ovhcloud.com/fr-ca/vps/compare/',
  MA: 'https://www.ovhcloud.com/fr-ma/vps/compare/',
  SN: 'https://www.ovhcloud.com/fr-sn/vps/compare/',
  TN: 'https://www.ovhcloud.com/fr-tn/vps/compare/',
  AU: 'https://www.ovhcloud.com/en-au/vps/compare/',
  SG: 'https://www.ovhcloud.com/en-sg/vps/compare/',
  ASIA: 'https://www.ovhcloud.com/asia/vps/compare/',
  WS: 'https://www.ovhcloud.com/es/vps/compare/',
  WE: 'https://www.ovhcloud.com/en/vps/compare/ ',
  US: 'https://us.ovhcloud.com/vps/compare/',
  DEFAULT: 'https://www.ovhcloud.com/en/vps/compare/',
};

export const VPS_MIGRATION_FAQ_LINKS = {
  FR: 'https://www.ovhcloud.com/fr/vps/vps-offer-migration/',
  ES: 'https://www.ovhcloud.com/en-ie/vps/vps-offer-migration/',
  DE: 'https://www.ovhcloud.com/en-ie/vps/vps-offer-migration/',
  IE: 'https://www.ovhcloud.com/en-ie/vps/vps-offer-migration/',
  IT: 'https://www.ovhcloud.com/en-ie/vps/vps-offer-migration/',
  NL: 'https://www.ovhcloud.com/en-ie/vps/vps-offer-migration/',
  PL: 'https://www.ovhcloud.com/en-ie/vps/vps-offer-migration/',
  PT: 'https://www.ovhcloud.com/en-ie/vps/vps-offer-migration/',
  GB: 'https://www.ovhcloud.com/en-gb/vps/vps-offer-migration/',
  CA: 'https://www.ovhcloud.com/en-ca/vps/vps-offer-migration/',
  QC: 'https://www.ovhcloud.com/fr-ca/vps/vps-offer-migration/',
  MA: 'https://www.ovhcloud.com/fr-ma/vps/vps-offer-migration/',
  SN: 'https://www.ovhcloud.com/fr-sn/vps/vps-offer-migration/',
  TN: 'https://www.ovhcloud.com/fr-tn/vps/vps-offer-migration/',
  AU: 'https://www.ovhcloud.com/en-au/vps/vps-offer-migration/',
  SG: 'https://www.ovhcloud.com/en-sg/vps/vps-offer-migration/',
  ASIA: 'https://www.ovhcloud.com/asia/vps/vps-offer-migration/',
  IN: 'https://www.ovhcloud.com/en-in/vps/vps-offer-migration/',
  WS: 'https://www.ovhcloud.com/en-ca/vps/vps-offer-migration/',
  WE: 'https://www.ovhcloud.com/en-ie/vps/vps-offer-migration/',
  DEFAULT: 'https://www.ovhcloud.com/en-ie/vps/vps-offer-migration/',
};

export default {
  ADD_DOMAIN_LINK_SUFFIX_URL,
  DASHBOARD_FEATURES,
  MIGRATION_STATUS,
  NEW_RANGE_VERSION,
  SERVICE_TYPE,
  VPS_STATES,
  VPS_RANGE_COMPARE_LINKS,
  VPS_MIGRATION_FAQ_LINKS,
};
