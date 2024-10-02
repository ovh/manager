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

export const LOAD_BALANCER_LOGS_SERVICE_GUIDE_LINK = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062950',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062936',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062949',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062945',
  WE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062946',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062946',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062940',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062948',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062947',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062942',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062943',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062944',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062941',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062939',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062937',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-network-loadbalancer-logs-forward?id=kb_article_view&sysparm_article=KB0062938',
};

export const ACTIONS_LIST = [
  {
    value: ACTIONS.REDIRECT_TO_URL,
    label: ACTION_LABELS[ACTIONS.REDIRECT_TO_URL],
  },
  {
    value: ACTIONS.REDIRECT_TO_POOL,
    label: ACTION_LABELS[ACTIONS.REDIRECT_TO_POOL],
  },
  {
    value: ACTIONS.REDIRECT_PREFIX,
    label: ACTION_LABELS[ACTIONS.REDIRECT_PREFIX],
  },
  {
    value: ACTIONS.REJECT,
    label: ACTION_LABELS[ACTIONS.REJECT],
  },
];

export const REDIRECT_HTTP_CODES = [301, 302, 303, 307, 308];

export const UNAVAILABLE_POOL_PROTOCOLS = ['tcp', 'udp', 'sctp'];

export const URL_PATTERN = /^(http(s)?:\/\/)[\w.-]+[\w\-._~:/?#[\]@!$&'()*+,;=%]+$/;

export const URL_PLACEHOLDER = 'https://example.com';
