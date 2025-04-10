export const CHANGELOG_LINKS = {
  changelog: 'https://github.com/orgs/ovh/projects/16/views/6?pane=info',
  roadmap: 'https://github.com/orgs/ovh/projects/16/views/1?pane=info',
  'feature-request':
    'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};
export const VOLUME_MIN_SIZE = 10; // 10 Gio
export const VOLUME_UNLIMITED_QUOTA = -1; // Should be 10 * 1024 (but API is wrong)
export const DEFAULT_MAX_SIZE = 4000;
export const VOLUME_NAME_MAX_LENGTH = 255;

export const LOCAL_ZONE_URL: Record<string, string> = {
  DEFAULT: 'https://ovhcloud.com/en/public-cloud/local-zone-compute/',
  ASIA: 'https://ovhcloud.com/asia/public-cloud/local-zone-compute/',
  DE: 'https://ovhcloud.com/de/public-cloud/local-zone-compute/',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/local-zone-compute/',
  IE: 'https://ovhcloud.com/en-ie/public-cloud/local-zone-compute/',
  IT: 'https://ovhcloud.com/it/public-cloud/local-zone-compute/',
  NL: 'https://ovhcloud.com/nl/public-cloud/local-zone-compute/',
  PL: 'https://ovhcloud.com/pl/public-cloud/local-zone-compute/',
  PT: 'https://ovhcloud.com/pt/public-cloud/local-zone-compute/',
  GB: 'https://ovhcloud.com/en-gb/public-cloud/local-zone-compute/',
  CA: 'https://ovhcloud.com/en-ca/public-cloud/local-zone-compute/',
  QC: 'https://ovhcloud.com/fr-ca/public-cloud/local-zone-compute/',
  MA: 'https://ovhcloud.com/fr-ma/public-cloud/local-zone-compute/',
  SN: 'https://ovhcloud.com/fr-sn/public-cloud/local-zone-compute/',
  TN: 'https://ovhcloud.com/fr-tn/public-cloud/local-zone-compute/',
  AU: 'https://ovhcloud.com/en-au/public-cloud/local-zone-compute/',
  SG: 'https://ovhcloud.com/en-sg/public-cloud/local-zone-compute/',
  FR: 'https://ovhcloud.com/fr/public-cloud/local-zone-compute/',
  WE: 'https://ovhcloud.com/us-en/public-cloud/local-zone-compute/',
  WS: 'https://ovhcloud.com/us-en/public-cloud/local-zone-compute/',
  US: 'https://us.ovhcloud.com/public-cloud/local-zone-compute/',
};

export const GLOBAL_REGIONS_URL: Record<string, string> = {
  DEFAULT:
    'https://www.ovhcloud.com/en/about-us/global-infrastructure/expansion-regions-az/',
  ASIA:
    'https://www.ovhcloud.com/asia/about-us/global-infrastructure/expansion-regions-az/',
  DE:
    'https://www.ovhcloud.com/de/about-us/global-infrastructure/expansion-regions-az/',
  ES:
    'https://www.ovhcloud.com/es/about-us/global-infrastructure/expansion-regions-az/',
  IE:
    'https://www.ovhcloud.com/en-ie/about-us/global-infrastructure/expansion-regions-az/',
  IT:
    'https://www.ovhcloud.com/it/about-us/global-infrastructure/expansion-regions-az/',
  NL:
    'https://www.ovhcloud.com/nl/about-us/global-infrastructure/expansion-regions-az/',
  PL:
    'https://www.ovhcloud.com/pl/about-us/global-infrastructure/expansion-regions-az/',
  PT:
    'https://www.ovhcloud.com/pt/about-us/global-infrastructure/expansion-regions-az/',
  GB:
    'https://www.ovhcloud.com/en-gb/about-us/global-infrastructure/expansion-regions-az/',
  CA:
    'https://www.ovhcloud.com/en-ca/about-us/global-infrastructure/expansion-regions-az/',
  QC:
    'https://www.ovhcloud.com/fr-ca/about-us/global-infrastructure/expansion-regions-az/',
  MA:
    'https://www.ovhcloud.com/fr-ma/about-us/global-infrastructure/expansion-regions-az/',
  SN:
    'https://www.ovhcloud.com/fr-sn/about-us/global-infrastructure/expansion-regions-az/',
  TN:
    'https://www.ovhcloud.com/fr-tn/about-us/global-infrastructure/expansion-regions-az/',
  AU:
    'https://www.ovhcloud.com/en-au/about-us/global-infrastructure/expansion-regions-az/',
  SG:
    'https://www.ovhcloud.com/en-sg/about-us/global-infrastructure/expansion-regions-az/',
  FR:
    'https://www.ovhcloud.com/fr/about-us/global-infrastructure/expansion-regions-az/',
  WS:
    'https://www.ovhcloud.com/en/about-us/global-infrastructure/expansion-regions-az/',
  US:
    'https://www.ovhcloud.com/en/about-us/global-infrastructure/expansion-regions-az/',
  WE:
    'https://www.ovhcloud.com/en/about-us/global-infrastructure/expansion-regions-az/',
};

export const URL_INFO = {
  LOCAL_ZONE: LOCAL_ZONE_URL,
  GLOBAL_REGIONS: GLOBAL_REGIONS_URL,
};
