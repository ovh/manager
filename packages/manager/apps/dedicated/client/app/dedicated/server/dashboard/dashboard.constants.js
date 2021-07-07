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
  EU: 'http://weathermap.ovh.net/',
  CA: 'http://weathermap.ovh.net/',
  US: 'http://weathermap.ovh.net/#usa',
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

export default {
  ELIGIBLE_FOR_UPGRADE,
  URLS,
  WEATHERMAP_URL,
  COMMIT_IMPRESSION_TRACKING_DATA,
  RECOMMIT_IMPRESSION_TRACKING_DATA,
  UPGRADE_TYPE,
};
