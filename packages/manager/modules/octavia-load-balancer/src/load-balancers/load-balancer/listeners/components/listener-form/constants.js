export const PROTOCOLS = {
  HTTP: 'http',
  HTTPS: 'https',
  TCP: 'tcp',
  UDP: 'udp',
  PROMETHEUS: 'prometheus',
};

export const PROTOCOLS_PORT = { http: 80, https: 443 };

export const LISTENER_POOL_PROTOCOL_COMBINATION = {
  http: ['http', 'proxy', 'proxyv2'],
  https: ['https', 'proxy', 'proxyv2', 'tcp'],
  tcp: ['http', 'https', 'proxy', 'proxyv2', 'tcp'],
  udp: ['udp'],
  prometheus: [],
};

export default {
  PROTOCOLS,
  LISTENER_POOL_PROTOCOL_COMBINATION,
};
