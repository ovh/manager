export const VEEAM_ORDER_URLS = {
  DEFAULT: 'https://ovhcloud.com/en/storage-solutions/veeam-enterprise',
  ASIA: 'https://ovhcloud.com/asia/storage-solutions/veeam-enterprise',
  IN: 'https://www.ovhcloud.com/en-in/storage-solutions/veeam-enterprise',
  DE: 'https://ovhcloud.com/de/storage-solutions/veeam-enterprise',
  ES: 'https://ovhcloud.com/es-es/storage-solutions/veeam-enterprise',
  IE: 'https://ovhcloud.com/en-ie/storage-solutions/veeam-enterprise',
  IT: 'https://ovhcloud.com/it/storage-solutions/veeam-enterprise',
  NL: 'https://ovhcloud.com/nl/storage-solutions/veeam-enterprise',
  PL: 'https://ovhcloud.com/pl/storage-solutions/veeam-enterprise',
  PT: 'https://ovhcloud.com/pt/storage-solutions/veeam-enterprise',
  GB: 'https://ovhcloud.com/en-gb/storage-solutions/veeam-enterprise',
  CA: 'https://ovhcloud.com/en-ca/storage-solutions/veeam-enterprise',
  QC: 'https://ovhcloud.com/fr-ca/storage-solutions/veeam-enterprise',
  MA: 'https://ovhcloud.com/fr-ma/storage-solutions/veeam-enterprise',
  SN: 'https://ovhcloud.com/fr-sn/storage-solutions/veeam-enterprise',
  TN: 'https://ovhcloud.com/fr-tn/storage-solutions/veeam-enterprise',
  AU: 'https://ovhcloud.com/en-au/storage-solutions/veeam-enterprise',
  SG: 'https://ovhcloud.com/en-sg/storage-solutions/veeam-enterprise',
  FR: 'https://ovhcloud.com/fr/storage-solutions/veeam-enterprise',
  WE: 'https://ovhcloud.com/en/storage-solutions/veeam-enterprise',
  WS: 'https://ovhcloud.com/es/storage-solutions/veeam-enterprise',
  US:
    'https://us.ovhcloud.com/enterprise/products/hosted-private-cloud/veeam-enterprise/',
};

export function getVeeamOrderUrl(subsidiary) {
  return VEEAM_ORDER_URLS[subsidiary] || VEEAM_ORDER_URLS.DEFAULT;
}

export default VEEAM_ORDER_URLS;
