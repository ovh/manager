export const ANTHOS_ORDER_URLS = {
  DEFAULT: 'https://ovhcloud.com/en/hosted-private-cloud/anthos/',
  ASIA: 'https://ovhcloud.com/asia/hosted-private-cloud/anthos/',
  DE: 'https://ovhcloud.com/de/hosted-private-cloud/anthos/',
  ES: 'https://ovhcloud.com/es-es/hosted-private-cloud/anthos/',
  IE: 'https://ovhcloud.com/en-ie/hosted-private-cloud/anthos/',
  IT: 'https://ovhcloud.com/it/hosted-private-cloud/anthos/',
  NL: 'https://ovhcloud.com/nl/hosted-private-cloud/anthos/',
  PL: 'https://ovhcloud.com/pl/hosted-private-cloud/anthos/',
  PT: 'https://ovhcloud.com/pt/hosted-private-cloud/anthos/',
  GB: 'https://ovhcloud.com/en-gb/hosted-private-cloud/anthos/',
  CA: 'https://ovhcloud.com/en-ca/hosted-private-cloud/anthos/',
  QC: 'https://ovhcloud.com/fr-ca/hosted-private-cloud/anthos/',
  MA: 'https://ovhcloud.com/fr-ma/hosted-private-cloud/anthos/',
  SN: 'https://ovhcloud.com/fr-sn/hosted-private-cloud/anthos/',
  TN: 'https://ovhcloud.com/fr-tn/hosted-private-cloud/anthos/',
  AU: 'https://ovhcloud.com/en-au/hosted-private-cloud/anthos/',
  SG: 'https://ovhcloud.com/en-sg/hosted-private-cloud/anthos/',
  FR: 'https://ovhcloud.com/fr/hosted-private-cloud/anthos/',
  CZ: 'https://ovhcloud.com/cz-cs/hosted-private-cloud/anthos/',
  FI: 'https://ovhcloud.com/fi/hosted-private-cloud/anthos/',
  LT: 'https://ovhcloud.com/lt/hosted-private-cloud/anthos/',
  WE: 'https://ovhcloud.com/us-en/hosted-private-cloud/anthos/',
  WS: 'https://ovhcloud.com/us-en/hosted-private-cloud/anthos/',
};

export function getAnthosOrderUrl(subsidiary) {
  return ANTHOS_ORDER_URLS[subsidiary] || ANTHOS_ORDER_URLS.DEFAULT;
}

export default ANTHOS_ORDER_URLS;
