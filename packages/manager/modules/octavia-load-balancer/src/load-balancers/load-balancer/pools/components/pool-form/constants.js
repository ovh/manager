export const DEFAULT_ALGORITHM = 'roundRobin';

export const DEFAULT_SESSION_PERSISTENCE_TYPE = 'sourceIP';

const persistenceTypes = ['sourceIP', 'httpCookie', 'appCookie'];

export const APP_COOKIE_SESSION_PERSISTENCE = persistenceTypes[2];

export const PROTOCOL_SESSION_PERSISTENCE_TYPE_COMBINATION = {
  http: persistenceTypes,
  https: persistenceTypes,
  tcp: persistenceTypes,
  proxy: persistenceTypes,
  proxyV2: persistenceTypes,
  udp: [persistenceTypes[0]],
  sctp: [persistenceTypes[0]],
};

export default {
  DEFAULT_ALGORITHM,
  DEFAULT_SESSION_PERSISTENCE_TYPE,
  APP_COOKIE_SESSION_PERSISTENCE,
  PROTOCOL_SESSION_PERSISTENCE_TYPE_COMBINATION,
};
