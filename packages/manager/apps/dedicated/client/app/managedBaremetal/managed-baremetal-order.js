export const MANAGED_BARE_METAL_ORDER_URLS = {
  DEFAULT: 'https://ovhcloud.com/en/managed-bare-metal/',
  ASIA: 'https://ovhcloud.com/asia/managed-bare-metal/',
  DE: 'https://ovhcloud.com/de/managed-bare-metal/',
  ES: 'https://ovhcloud.com/es-es/managed-bare-metal/',
  IE: 'https://ovhcloud.com/en-ie/managed-bare-metal/',
  IT: 'https://ovhcloud.com/it/managed-bare-metal/',
  NL: 'https://ovhcloud.com/nl/managed-bare-metal/',
  PL: 'https://ovhcloud.com/pl/managed-bare-metal/',
  PT: 'https://ovhcloud.com/pt/managed-bare-metal/',
  GB: 'https://ovhcloud.com/en-gb/managed-bare-metal/',
  CA: 'https://ovhcloud.com/en-ca/managed-bare-metal/',
  QC: 'https://ovhcloud.com/fr-ca/managed-bare-metal/',
  MA: 'https://ovhcloud.com/fr-ma/managed-bare-metal/',
  SN: 'https://ovhcloud.com/fr-sn/managed-bare-metal/',
  TN: 'https://ovhcloud.com/fr-tn/managed-bare-metal/',
  AU: 'https://ovhcloud.com/en-au/managed-bare-metal/',
  SG: 'https://ovhcloud.com/en-sg/managed-bare-metal/',
  FR: 'https://ovhcloud.com/fr/managed-bare-metal/',
  CZ: 'https://ovhcloud.com/cz-cs/managed-bare-metal/',
  FI: 'https://ovhcloud.com/fi/managed-bare-metal/',
  LT: 'https://ovhcloud.com/lt/managed-bare-metal/',
  WE: 'https://ovhcloud.com/us-en/managed-bare-metal/',
  WS: 'https://ovhcloud.com/us-en/managed-bare-metal/',
  IN: 'https://ovhcloud.com/en-in/managed-bare-metal/',
};

export function getManagedBareMetalOrderUrl(subsidiary) {
  return (
    MANAGED_BARE_METAL_ORDER_URLS[subsidiary] ||
    MANAGED_BARE_METAL_ORDER_URLS.DEFAULT
  );
}

export default MANAGED_BARE_METAL_ORDER_URLS;
