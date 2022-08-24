export const VEEAM_ORDER_URLS = {
  DEFAULT: 'https://ovhcloud.com/en/storage-solutions/veeam-cloud-connect',
  ASIA: 'https://ovhcloud.com/asia/storage-solutions/veeam-cloud-connect',
  DE: 'https://ovhcloud.com/de/storage-solutions/veeam-cloud-connect',
  ES: 'https://ovhcloud.com/es-es/storage-solutions/veeam-cloud-connect',
  IE: 'https://ovhcloud.com/en-ie/storage-solutions/veeam-cloud-connect',
  IT: 'https://ovhcloud.com/it/storage-solutions/veeam-cloud-connect',
  NL: 'https://ovhcloud.com/nl/storage-solutions/veeam-cloud-connect',
  PL: 'https://ovhcloud.com/pl/storage-solutions/veeam-cloud-connect',
  PT: 'https://ovhcloud.com/pt/storage-solutions/veeam-cloud-connect',
  GB: 'https://ovhcloud.com/en-gb/storage-solutions/veeam-cloud-connect',
  CA: 'https://ovhcloud.com/en-ca/storage-solutions/veeam-cloud-connect',
  QC: 'https://ovhcloud.com/fr-ca/storage-solutions/veeam-cloud-connect',
  MA: 'https://ovhcloud.com/fr-ma/storage-solutions/veeam-cloud-connect',
  SN: 'https://ovhcloud.com/fr-sn/storage-solutions/veeam-cloud-connect',
  TN: 'https://ovhcloud.com/fr-tn/storage-solutions/veeam-cloud-connect',
  AU: 'https://ovhcloud.com/en-au/storage-solutions/veeam-cloud-connect',
  SG: 'https://ovhcloud.com/en-sg/storage-solutions/veeam-cloud-connect',
  FR: 'https://ovhcloud.com/fr/storage-solutions/veeam-cloud-connect',
  CZ: 'https://ovhcloud.com/cz-cs/storage-solutions/veeam-cloud-connect',
  FI: 'https://ovhcloud.com/fi/storage-solutions/veeam-cloud-connect',
  LT: 'https://ovhcloud.com/lt/storage-solutions/veeam-cloud-connect',
  WE: 'https://ovhcloud.com/us-en/storage-solutions/veeam-cloud-connect',
  WS: 'https://ovhcloud.com/us-en/storage-solutions/veeam-cloud-connect',
};

export function getVeeamOrderUrl(subsidiary) {
  return VEEAM_ORDER_URLS[subsidiary] || VEEAM_ORDER_URLS.DEFAULT;
}

export default VEEAM_ORDER_URLS;
