export const HOSTING_ORDER_URLS = {
  DEFAULT: 'https://ovhcloud.com/en/web-hosting/',
  ASIA: 'https://ovhcloud.com/asia/web-hosting/',
  IN: 'https://www.ovhcloud.com/en-in/web-hosting/',
  DE: 'https://ovhcloud.com/de/web-hosting/',
  ES: 'https://ovhcloud.com/es-es/web-hosting/',
  IE: 'https://ovhcloud.com/en-ie/web-hosting/',
  IT: 'https://ovhcloud.com/it/web-hosting/',
  NL: 'https://ovhcloud.com/nl/web-hosting/',
  PL: 'https://ovhcloud.com/pl/web-hosting/',
  PT: 'https://ovhcloud.com/pt/web-hosting/',
  GB: 'https://ovhcloud.com/en-gb/web-hosting/',
  CA: 'https://ovhcloud.com/en-ca/web-hosting/',
  QC: 'https://ovhcloud.com/fr-ca/web-hosting/',
  MA: 'https://ovhcloud.com/fr-ma/web-hosting/',
  SN: 'https://ovhcloud.com/fr-sn/web-hosting/',
  TN: 'https://ovhcloud.com/fr-tn/web-hosting/',
  AU: 'https://ovhcloud.com/en-au/web-hosting/',
  SG: 'https://ovhcloud.com/en-sg/web-hosting/',
  FR: 'https://ovhcloud.com/fr/web-hosting/',
  CZ: 'https://ovhcloud.com/cz-cs/web-hosting/',
  FI: 'https://ovhcloud.com/fi/web-hosting/',
  LT: 'https://ovhcloud.com/lt/web-hosting/',
  WE: 'https://ovhcloud.com/us-en/web-hosting/',
  WS: 'https://ovhcloud.com/us-en/web-hosting/',
};

export function getHostingOrderUrl(subsidiary) {
  return HOSTING_ORDER_URLS[subsidiary] || HOSTING_ORDER_URLS.DEFAULT;
}

export default HOSTING_ORDER_URLS;
