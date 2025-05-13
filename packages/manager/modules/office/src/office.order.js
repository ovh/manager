export const OFFICE_ORDER_URLS = {
  DEFAULT: 'https://ovhcloud.com/en/collaborative-tools/microsoft-365/',
  ASIA: 'https://ovhcloud.com/asia/collaborative-tools/microsoft-365/',
  IN: 'https://www.ovhcloud.com/en-in/collaborative-tools/microsoft-365/',
  DE: 'https://ovhcloud.com/de/collaborative-tools/microsoft-365/',
  ES: 'https://ovhcloud.com/es-es/collaborative-tools/microsoft-365/',
  IE: 'https://ovhcloud.com/en-ie/collaborative-tools/microsoft-365/',
  IT: 'https://ovhcloud.com/it/collaborative-tools/microsoft-365/',
  NL: 'https://ovhcloud.com/nl/collaborative-tools/microsoft-365/',
  PL: 'https://ovhcloud.com/pl/collaborative-tools/microsoft-365/',
  PT: 'https://ovhcloud.com/pt/collaborative-tools/microsoft-365/',
  GB: 'https://ovhcloud.com/en-gb/collaborative-tools/microsoft-365/',
  CA: 'https://ovhcloud.com/en-ca/collaborative-tools/microsoft-365/',
  QC: 'https://ovhcloud.com/fr-ca/collaborative-tools/microsoft-365/',
  MA: 'https://ovhcloud.com/fr-ma/collaborative-tools/microsoft-365/',
  SN: 'https://ovhcloud.com/fr-sn/collaborative-tools/microsoft-365/',
  TN: 'https://ovhcloud.com/fr-tn/collaborative-tools/microsoft-365/',
  AU: 'https://ovhcloud.com/en-au/collaborative-tools/microsoft-365/',
  SG: 'https://ovhcloud.com/en-sg/collaborative-tools/microsoft-365/',
  FR: 'https://ovhcloud.com/fr/collaborative-tools/microsoft-365/',
  CZ: 'https://ovhcloud.com/cz-cs/collaborative-tools/microsoft-365/',
  FI: 'https://ovhcloud.com/fi/collaborative-tools/microsoft-365/',
  LT: 'https://ovhcloud.com/lt/collaborative-tools/microsoft-365/',
  WE: 'https://ovhcloud.com/us-en/collaborative-tools/microsoft-365/',
  WS: 'https://ovhcloud.com/us-en/collaborative-tools/microsoft-365/',
};

export function getOfficeOrderUrl(subsidiary) {
  return OFFICE_ORDER_URLS[subsidiary] || OFFICE_ORDER_URLS.DEFAULT;
}

export default OFFICE_ORDER_URLS;
