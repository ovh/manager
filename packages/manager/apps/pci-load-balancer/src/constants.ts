export const ACTIVE_STATUS = ['ok', 'READY'];
export const PENDING_STATUS = ['PENDING', 'CREATING', 'UPDATING', 'DELETING'];

export const HORIZON_LINK = {
  EU: 'https://horizon.cloud.ovh.net/auth/login?username={username}',
  CA: 'https://horizon.cloud.ovh.net/auth/login?username={username}',
  US: 'https://horizon.cloud.ovh.us/auth/login?username={username}',
};

export const HORIZON_LINK_TRUSTED = {
  EU:
    'https://horizon.trustedzone.cloud.ovh.net/auth/login?username={username}',
  CA:
    'https://horizon.trustedzone.cloud.ovh.net/auth/login?username={username}',
  US: '',
};

export const ALPHA_CHARACTERS_REGEX = /^[a-zA-Z-]+$/;

export const TRACKING_CHAPTER_1 = 'PublicCloud';

export const TRACKING_OCTAVIA_LOAD_BALANCERS_PREFIX =
  'pci::projects::project::octavia-loadbalancer';

export const DISCOVER_LINK =
  'https://horizon.cloud.ovh.net/project/load_balancer';

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
