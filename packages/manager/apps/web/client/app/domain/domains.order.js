export const DOMAIN_ORDER_URLS = {
  DEFAULT: 'https://www.ovh.com/en/order/webcloud/',
  ASIA: 'https://www.ovh.com/en/order/webcloud/',
  DE: 'https://www.ovh.com/de/order/webcloud/',
  ES: 'https://www.ovh.com/es/order/webcloud/',
  IE: 'https://www.ovh.com/en/order/webcloud/',
  IT: 'https://www.ovh.com/it/order/webcloud/',
  NL: 'https://www.ovh.com/nl/order/webcloud/',
  PL: 'https://www.ovh.com/pl/order/webcloud/',
  PT: 'https://www.ovh.com/pt/order/webcloud/',
  GB: 'https://www.ovh.com/en/order/webcloud/',
  CA: 'https://www.ovh.com/en/order/webcloud/',
  QC: 'https://www.ovh.com/fr/order/webcloud/',
  MA: 'https://www.ovh.com/fr/order/webcloud/',
  SN: 'https://www.ovh.com/fr/order/webcloud/',
  TN: 'https://www.ovh.com/fr/order/webcloud/',
  AU: 'https://www.ovh.com/en/order/webcloud/',
  SG: 'https://www.ovh.com/en/order/webcloud/',
  FR: 'https://www.ovh.com/fr/order/webcloud/',
  CZ: 'https://www.ovh.com/cz/order/webcloud/',
  FI: 'https://www.ovh.com/fi/order/webcloud/',
  LT: 'https://www.ovh.com/lt/order/webcloud/',
  WE: 'https://www.ovh.com/en/order/webcloud/',
  WS: 'https://www.ovh.com/en/order/webcloud/',
  IN: 'https://www.ovh.com/en/order/webcloud/',
};

export function getDomainOrderUrl(subsidiary) {
  return DOMAIN_ORDER_URLS[subsidiary] || DOMAIN_ORDER_URLS.DEFAULT;
}

export default DOMAIN_ORDER_URLS;
