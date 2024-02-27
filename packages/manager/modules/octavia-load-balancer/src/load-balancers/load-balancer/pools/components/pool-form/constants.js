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

export default {
  DEFAULT_ALGORITHM,
  DEFAULT_SESSION_PERSISTENCE_TYPE,
  APP_COOKIE_SESSION_PERSISTENCE,
  PROTOCOL_SESSION_PERSISTENCE_TYPE_COMBINATION,
};
