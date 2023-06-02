export const VPS_ORDER_URLS = {
  DEFAULT: 'https://ovhcloud.com/en/vps',
  ASIA: 'https://ovhcloud.com/asia/vps',
  IN: 'https://www.ovhcloud.com/en-in/vps',
  DE: 'https://ovhcloud.com/de/vps',
  ES: 'https://ovhcloud.com/es-es/vps',
  IE: 'https://ovhcloud.com/en-ie/vps',
  IT: 'https://ovhcloud.com/it/vps',
  NL: 'https://ovhcloud.com/nl/vps',
  PL: 'https://ovhcloud.com/pl/vps',
  PT: 'https://ovhcloud.com/pt/vps',
  GB: 'https://ovhcloud.com/en-gb/vps',
  CA: 'https://ovhcloud.com/en-ca/vps',
  QC: 'https://ovhcloud.com/fr-ca/vps',
  MA: 'https://ovhcloud.com/fr-ma/vps',
  SN: 'https://ovhcloud.com/fr-sn/vps',
  TN: 'https://ovhcloud.com/fr-tn/vps',
  AU: 'https://ovhcloud.com/en-au/vps',
  SG: 'https://ovhcloud.com/en-sg/vps',
  FR: 'https://ovhcloud.com/fr/vps',
  CZ: 'https://ovhcloud.com/cz-cs/vps',
  FI: 'https://ovhcloud.com/fi/vps',
  LT: 'https://ovhcloud.com/lt/vps',
  WE: 'https://ovhcloud.com/us-en/vps',
  WS: 'https://ovhcloud.com/us-en/vps',
  US: 'https://us.ovhcloud.com/vps/',
};

export function getVpsOrderUrl(subsidiary) {
  return VPS_ORDER_URLS[subsidiary] || VPS_ORDER_URLS.DEFAULT;
}

export default VPS_ORDER_URLS;
