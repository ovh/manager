export const LOAD_BALANCER_ORDER_URLS = {
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/load-balancer-kubernetes/',
  FR: 'https://www.ovhcloud.com/fr/public-cloud/load-balancer-kubernetes/',
  MA: 'https://www.ovhcloud.com/fr-ma/public-cloud/load-balancer-kubernetes/',
  TN: 'https://www.ovhcloud.com/fr-tn/public-cloud/load-balancer-kubernetes/',
  SN: 'https://www.ovhcloud.com/fr-sn/public-cloud/load-balancer-kubernetes/',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/load-balancer-kubernetes/',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/load-balancer-kubernetes/',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/load-balancer-kubernetes/',
  WE: 'https://www.ovhcloud.com/en/public-cloud/load-balancer-kubernetes/',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/load-balancer-kubernetes/',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/load-balancer-kubernetes/',
  SG: 'https://www.ovhcloud.com/en-sg/public-cloud/load-balancer-kubernetes/',
  ASIA: 'https://www.ovhcloud.com/asia/public-cloud/load-balancer-kubernetes/',
  IN: 'https://www.ovhcloud.com/en-in/public-cloud/load-balancer-kubernetes/',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/load-balancer-kubernetes/',
  WS: 'https://www.ovhcloud.com/es/public-cloud/load-balancer-kubernetes/',
  PT: ' https://www.ovhcloud.com/pt/public-cloud/load-balancer-kubernetes/',
  IT: 'https://www.ovhcloud.com/it/public-cloud/load-balancer-kubernetes/',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/load-balancer-kubernetes/',
  DE: 'https://www.ovhcloud.com/de/public-cloud/load-balancer-kubernetes/',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/load-balancer-kubernetes/',
  US: 'https://us.ovhcloud.com/public-cloud/load-balancer-kubernetes/',
};

export function getLoadBalancerOrderUrl(subsidiary) {
  return (
    LOAD_BALANCER_ORDER_URLS[subsidiary] || LOAD_BALANCER_ORDER_URLS.DEFAULT
  );
}

export default LOAD_BALANCER_ORDER_URLS;
