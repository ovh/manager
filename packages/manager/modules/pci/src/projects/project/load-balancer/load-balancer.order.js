export const LOAD_BALANCER_ORDER_URLS = {
  DEFAULT: 'https://www.ovh.com/world/solutions/load-balancer/',
  DE: 'https://www.ovh.de/loesungen/load-balancer/',
  IT: 'https://www.ovh.it/soluzioni/load-balancer/',
  NL: 'https://www.ovh.nl/oplossing/load-balancer/',
  PL: 'https://www.ovh.pl/rozwiazania/load-balancer/',
  PT: 'https://www.ovh.pt/solucoes/load-balancer/',
  FR: 'https://www.ovh.com/fr/solutions/load-balancer/',
  WS: 'https://www.ovh.com/world/es/soluciones/load-balancer/',
  US: 'https://us.ovhcloud.com/public-cloud/load-balancer-kubernetes/',
};

export function getLoadBalancerOrderUrl(subsidiary) {
  return (
    LOAD_BALANCER_ORDER_URLS[subsidiary] || LOAD_BALANCER_ORDER_URLS.DEFAULT
  );
}

export default LOAD_BALANCER_ORDER_URLS;
