export const COLD_ARCHIVE_TRACKING_PREFIX =
  'PublicCloud::pci::projects::project::storages::cold_archive';

export const REGION = 'RBX-ARCHIVE';

export const DATE_FORMAT = 'DD/MM/YYYY HH:mm';

export const CHECK_PRICES_DOC_LINK = {
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/prices/#',
  DE: 'https://www.ovhcloud.com/de/public-cloud/prices/#',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/prices/#',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/prices/#',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/prices/#',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/prices/#',
  SG: 'https://www.ovhcloud.com/en-sq/public-cloud/prices/#',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/prices/#',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/prices/#',
  FR: 'https://www.ovhcloud.com/fr/public-cloud/prices/#',
  MA: 'https://www.ovhcloud.com/fr-ma/public-cloud/prices/#',
  SN: 'https://www.ovhcloud.com/fr-sn/public-cloud/prices/#',
  TN: 'https://www.ovhcloud.com/fr-tn/public-cloud/prices/#',
  IT: 'https://www.ovhcloud.com/it/public-cloud/prices/#',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/prices/#',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/prices/#',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/prices/#',
  WS: 'https://www.ovhcloud.com/es/public-cloud/prices/#',
  WE: 'https://www.ovhcloud.com/en/public-cloud/prices/#',
};

export const GUIDES = [
  {
    id: 'cold-archive-getting-started',
    link:
      'https://docs.ovh.com/fr/storage/s3/getting-started-with-cold-archive/',
  },
  {
    id: 'billing',
    link: 'https://docs.ovh.com/gb/en/storage/s3/getting-started-with-s3/',
  },
  {
    id: 'monitoring',
    link: 'https://docs.ovh.com/fr/storage/s3/limitations/',
  },
];

export default {
  COLD_ARCHIVE_TRACKING_PREFIX,
  CHECK_PRICES_DOC_LINK,
  REGION,
  GUIDES,
  DATE_FORMAT,
};
