export const MONITORING_STATUSES = {
  DISABLED: 'disabled',
  NOPROACTIVE: 'no-proactive',
  PROACTIVE: 'proactive',
};

export const DC_2_ISO = {
  BHS: 'CA',
  DC: 'CA',
  ERI: 'GB',
  GRA: 'FR',
  GSW: 'FR',
  HIL: 'US',
  LIM: 'DE',
  P: 'FR',
  RBX: 'FR',
  SBG: 'FR',
  SGP: 'SG',
  SYD: 'AU',
  VIN: 'US',
  WAW: 'PL',
  YNM: 'IN',
};

export const ELIGIBLE_FOR_UPGRADE = {
  PLAN_NAME: 'RISE-2',
  SUBSIDIARIES: ['GB'],
};

export const URLS = {
  GB: {
    UPGRADE: 'https://www.ovh.co.uk/dedicated_servers/rise/rise-2/',
  },
};

export const WEATHERMAP_URL = {
  US: 'http://weathermap.ovh.net/#usa',
  IN: 'https://weathermap.ovh.net/#mumbai_core',
  OTHERS: 'http://weathermap.ovh.net/',
};

const COMMIT_RECOMMIT_IMPRESSION_TRACKING_DATA = {
  campaignId: '[commit-recommit]',
  creation: '[batch2]',
  format: '[link]',
  generalPlacement: '[dedicated-server]',
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

export const UPGRADE_TYPE = {
  RAM: 'ram',
  STORAGE: 'storage',
};

export const VMS_URL_OTHERS = 'OTHERS';

export default {
  MONITORING_STATUSES,
  DC_2_ISO,
  ELIGIBLE_FOR_UPGRADE,
  URLS,
  WEATHERMAP_URL,
  COMMIT_IMPRESSION_TRACKING_DATA,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
  UPGRADE_TYPE,
  VMS_URL_OTHERS,
};
