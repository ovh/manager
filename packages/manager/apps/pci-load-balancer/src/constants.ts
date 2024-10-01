export const TRACKING_CHAPTER_1 = 'PublicCloud';

export const TRACKING_OCTAVIA_LOAD_BALANCERS_PREFIX =
  'pci::projects::project::octavia-loadbalancer';

export const DISCOVER_LINK =
  'https://horizon.cloud.ovh.net/project/load_balancer';

export const PROTOCOLS = ['http', 'https', 'tcp', 'udp', 'prometheus'] as const;

export const PROTOCOLS_PORT = { http: 80, https: 443 };

export const LISTENER_POOL_PROTOCOL_COMBINATION = {
  http: ['http', 'proxy', 'proxyv2'],
  https: ['https', 'proxy', 'proxyv2', 'tcp'],
  tcp: ['http', 'https', 'proxy', 'proxyv2', 'tcp'],
  udp: ['udp'],
  prometheus: [],
};

export const DEFAULT_ALGORITHM = 'roundRobin';
export const DEFAULT_SESSION_PERSISTENCE_TYPE = 'sourceIP';
export const APP_COOKIE_SESSION_PERSISTENCE = 'appCookie';

const persistenceTypes = [
  DEFAULT_SESSION_PERSISTENCE_TYPE,
  'httpCookie',
  APP_COOKIE_SESSION_PERSISTENCE,
];

export const PROTOCOL_SESSION_PERSISTENCE_TYPE_COMBINATION = {
  http: persistenceTypes,
  https: persistenceTypes,
  tcp: persistenceTypes,
  proxy: persistenceTypes,
  proxyV2: persistenceTypes,
  udp: [DEFAULT_SESSION_PERSISTENCE_TYPE],
  sctp: [DEFAULT_SESSION_PERSISTENCE_TYPE],
};

export const ACTIONS = {
  REDIRECT_TO_URL: 'redirectToURL',
  REDIRECT_TO_POOL: 'redirectToPool',
  REDIRECT_PREFIX: 'redirectPrefix',
  REJECT: 'reject',
};

export const ACTION_LABELS = {
  [ACTIONS.REDIRECT_TO_URL]: 'Redirect to URL',
  [ACTIONS.REDIRECT_TO_POOL]: 'Redirect to Pool',
  [ACTIONS.REDIRECT_PREFIX]: 'Redirect Prefix',
  [ACTIONS.REJECT]: 'Reject',
};
