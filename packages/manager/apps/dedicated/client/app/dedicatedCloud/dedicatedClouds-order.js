export const DEDICATED_CLOUD_ORDER_URLS = {
  DEFAULT:
    'https://ovhcloud.com/en/enterprise/products/hosted-private-cloud/prices/',
  ASIA:
    'https://ovhcloud.com/asia/enterprise/products/hosted-private-cloud/prices/',
  DE:
    'https://ovhcloud.com/de/enterprise/products/hosted-private-cloud/prices/',
  ES:
    'https://ovhcloud.com/es-es/enterprise/products/hosted-private-cloud/prices/',
  IE:
    'https://ovhcloud.com/en-ie/enterprise/products/hosted-private-cloud/prices/',
  IT:
    'https://ovhcloud.com/it/enterprise/products/hosted-private-cloud/prices/',
  NL:
    'https://ovhcloud.com/nl/enterprise/products/hosted-private-cloud/prices/',
  PL:
    'https://ovhcloud.com/pl/enterprise/products/hosted-private-cloud/prices/',
  PT:
    'https://ovhcloud.com/pt/enterprise/products/hosted-private-cloud/prices/',
  GB:
    'https://ovhcloud.com/en-gb/enterprise/products/hosted-private-cloud/prices/',
  CA:
    'https://ovhcloud.com/en-ca/enterprise/products/hosted-private-cloud/prices/',
  QC:
    'https://ovhcloud.com/fr-ca/enterprise/products/hosted-private-cloud/prices/',
  MA:
    'https://ovhcloud.com/fr-ma/enterprise/products/hosted-private-cloud/prices/',
  SN:
    'https://ovhcloud.com/fr-sn/enterprise/products/hosted-private-cloud/prices/',
  TN:
    'https://ovhcloud.com/fr-tn/enterprise/products/hosted-private-cloud/prices/',
  AU:
    'https://ovhcloud.com/en-au/enterprise/products/hosted-private-cloud/prices/',
  SG:
    'https://ovhcloud.com/en-sg/enterprise/products/hosted-private-cloud/prices/',
  FR:
    'https://ovhcloud.com/fr/enterprise/products/hosted-private-cloud/prices/',
  CZ:
    'https://ovhcloud.com/cz-cs/enterprise/products/hosted-private-cloud/prices/',
  FI:
    'https://ovhcloud.com/fi/enterprise/products/hosted-private-cloud/prices/',
  LT:
    'https://ovhcloud.com/lt/enterprise/products/hosted-private-cloud/prices/',
  WE:
    'https://ovhcloud.com/us-en/enterprise/products/hosted-private-cloud/prices/',
  WS:
    'https://ovhcloud.com/us-en/enterprise/products/hosted-private-cloud/prices/',
};

export function getDedicatedCloudOrderUrl(subsidiary) {
  return (
    DEDICATED_CLOUD_ORDER_URLS[subsidiary] || DEDICATED_CLOUD_ORDER_URLS.DEFAULT
  );
}

export default DEDICATED_CLOUD_ORDER_URLS;
