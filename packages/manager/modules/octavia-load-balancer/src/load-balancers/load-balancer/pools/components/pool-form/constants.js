export const DEFAULT_ALGORITHM = 'roundRobin';

export const DEFAULT_SESSION_PERSISTENCE_TYPE = 'sourceIP';

export const APP_COOKIE_SESSION_PERSISTENCE = 'appCookie';

export const PROTOCOL_SESSION_PERSISTENCE_TYPE_COMBINATION = {
  http: ['sourceIP', 'httpCookie', 'appCookie'],
  https: ['sourceIP', 'httpCookie', 'appCookie'],
  tcp: ['sourceIP', 'httpCookie', 'appCookie'],
  proxy: ['sourceIP', 'httpCookie', 'appCookie'],
  proxyV2: ['sourceIP', 'httpCookie', 'appCookie'],
  udp: ['sourceIP'],
  sctp: ['sourceIP'],
};

export default {
  DEFAULT_ALGORITHM,
  DEFAULT_SESSION_PERSISTENCE_TYPE,
  APP_COOKIE_SESSION_PERSISTENCE,
  PROTOCOL_SESSION_PERSISTENCE_TYPE_COMBINATION,
};
