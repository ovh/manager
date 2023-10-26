export const TRACKING_SUFFIX = 'listeners';

export const PROTOCOLS = ['http', 'https', 'tcp', 'udp', 'prometheus'];

export const LISTENER_POOL_PROTOCOL_COMBINATION = {
  http: ['http', 'proxy', 'proxyv2'],
  https: ['https', 'proxy', 'proxyv2', 'tcp'],
  tcp: ['http', 'https', 'proxy', 'proxyv2', 'tcp'],
  udp: ['udp'],
  prometheus: [],
};

export default {
  TRACKING_SUFFIX,
  PROTOCOLS,
  LISTENER_POOL_PROTOCOL_COMBINATION,
};
