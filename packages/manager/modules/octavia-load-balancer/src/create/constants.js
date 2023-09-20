export const PRODUCT_LINK = {
  FR: 'https://www.ovhcloud.com/fr/public-cloud/load-balancer/',
  DE: 'https://www.ovhcloud.com/de/public-cloud/load-balancer/',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/load-balancer/',
  WE: 'https://www.ovhcloud.com/en-ie/public-cloud/load-balancer/',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/load-balancer/',
  IT: 'https://www.ovhcloud.com/it/public-cloud/load-balancer/',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/load-balancer/',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/load-balancer/',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/load-balancer/',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/load-balancer/',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/load-balancer/',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/load-balancer/',
  WS: 'https://www.ovhcloud.com/es/public-cloud/load-balancer/',
  MA: 'https://www.ovhcloud.com/fr-ma/public-cloud/load-balancer/',
  SN: 'https://www.ovhcloud.com/fr-sn/public-cloud/load-balancer/',
  TN: 'https://www.ovhcloud.com/fr-tn/public-cloud/load-balancer/',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/load-balancer/',
  SG: 'https://www.ovhcloud.com/en-sg/public-cloud/load-balancer/',
  ASIA: 'https://www.ovhcloud.com/asia/public-cloud/load-balancer/',
  US: 'https://us.ovhcloud.com/en/public-cloud/load-balancer/',
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/load-balancer/',
};

export const REGION_AVAILABILITY_LINK = {
  FR: 'https://www.ovhcloud.com/fr/public-cloud/regions-availability',
  DE: 'https://www.ovhcloud.com/de/public-cloud/regions-availability/',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/regions-availability/',
  WE: 'https://www.ovhcloud.com/en-ie/public-cloud/regions-availability/',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/regions-availability/',
  IT: 'https://www.ovhcloud.com/it/public-cloud/regions-availability/',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/regions-availability/',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/regions-availability/',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/regions-availability/',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/regions-availability/',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/regions-availability/',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/regions-availability/',
  WS: 'https://www.ovhcloud.com/es/public-cloud/regions-availability/',
  MA: 'https://www.ovhcloud.com/fr-ma/public-cloud/regions-availability/',
  SN: 'https://www.ovhcloud.com/fr-sn/public-cloud/regions-availability/',
  TN: 'https://www.ovhcloud.com/fr-tn/public-cloud/regions-availability/',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/regions-availability/',
  SG: 'https://www.ovhcloud.com/en-sg/public-cloud/regions-availability/',
  ASIA: 'https://www.ovhcloud.com/asia/public-cloud/regions-availability/',
  US: 'https://us.ovhcloud.com/public-cloud/regions-availability/',
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/regions-availability/',
};

export const TRACKING_CHAPTER_1 = 'PublicCloud';

export const TRACKING_NAME =
  'pci::projects::project::octavia-loadbalancer::add';

export const TRACKING_PRODUCT_PAGE = `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::goto-product-page`;

export const TRACKING_REGION_AVAILABILITY = `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::goto-region-availability`;

export const TRACKING_PRIVATE_NETWORK_CREATION = `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::create-private-network`;

export const AGORA_ADDON_FAMILY = 'octavia-loadbalancer';

export const SIZE_FLAVOUR_REGEX = /octavia-loadbalancer.loadbalancer-([sml]).hour.consumption/;
export const AGORA_GATEWAY_REGEX = /gateway.s.hour.consumption/;

export const NETWORK_PRIVATE_VISIBILITY = 'private';

export default {
  PRODUCT_LINK,
  REGION_AVAILABILITY_LINK,
  TRACKING_CHAPTER_1,
  TRACKING_PRODUCT_PAGE,
  TRACKING_REGION_AVAILABILITY,
  TRACKING_PRIVATE_NETWORK_CREATION,
  AGORA_ADDON_FAMILY,
  TRACKING_NAME,
  SIZE_FLAVOUR_REGEX,
  AGORA_GATEWAY_REGEX,
  NETWORK_PRIVATE_VISIBILITY,
};
