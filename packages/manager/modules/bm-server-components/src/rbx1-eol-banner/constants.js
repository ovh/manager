export const GUIDE_LINKS = {
  DEFAULT: 'https://www.ovhcloud.com/en-ie/lp/end-service-rbx-1/',
  ASIA: 'https://www.ovhcloud.com/asia/lp/end-service-rbx-1/',
  AU: 'https://www.ovhcloud.com/en-au/lp/end-service-rbx-1/',
  CA: 'https://www.ovhcloud.com/en-ca/lp/end-service-rbx-1/',
  DE: 'https://www.ovhcloud.com/de/lp/end-service-rbx-1/',
  ES: 'https://www.ovhcloud.com/es-es/lp/end-service-rbx-1/',
  FR: 'https://www.ovhcloud.com/fr/lp/end-service-rbx-1/',
  GB: 'https://www.ovhcloud.com/en-gb/lp/end-service-rbx-1/',
  IE: 'https://www.ovhcloud.com/en-ie/lp/end-service-rbx-1/',
  IN: 'https://www.ovhcloud.com/en-in/lp/end-service-rbx-1/',
  IT: 'https://www.ovhcloud.com/it/lp/end-service-rbx-1/',
  MA: 'https://www.ovhcloud.com/fr-ma/lp/end-service-rbx-1/',
  NL: 'https://www.ovhcloud.com/nl/lp/end-service-rbx-1/',
  PL: 'https://www.ovhcloud.com/pl/lp/end-service-rbx-1/',
  PT: 'https://www.ovhcloud.com/pt/lp/end-service-rbx-1/',
  QC: 'https://www.ovhcloud.com/fr-ca/lp/end-service-rbx-1/',
  SN: 'https://www.ovhcloud.com/fr-sn/lp/end-service-rbx-1/',
  SG: 'https://www.ovhcloud.com/en-sg/lp/end-service-rbx-1/',
  TN: 'https://www.ovhcloud.com/fr-tn/lp/end-service-rbx-1/',
  US: 'https://www.ovhcloud.com/en/lp/end-service-rbx-1/',
  WE: 'https://www.ovhcloud.com/en-ie/lp/end-service-rbx-1/',
  WS: 'https://www.ovhcloud.com/es/lp/end-service-rbx-1/',
};

export const TRACKING_PREFIX = 'dedicated::dedicated-server::server';
export const TRACKING_CONTEXT = {
  chapter1: 'dedicated',
  chapter2: 'dedicated-server',
  chapter3: 'server',
  site_level2: 'Manager-DedicatedServers',
  page_theme: 'DedicatedServers',
  page_category: 'banner',
};
export const TRACKING_OPTIONS = {
  trackingClickLabel: `${TRACKING_PREFIX}::banner::link::go-to-migration-guide_rbx1-server`,
  trackingPageLabel: `${TRACKING_PREFIX}::server::banner-info::rbx1-eol_alert`,
};

export default {
  GUIDE_LINKS,
  TRACKING_CONTEXT,
  TRACKING_OPTIONS,
};
