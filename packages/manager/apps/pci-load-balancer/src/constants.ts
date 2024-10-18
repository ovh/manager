export const TRACKING_CHAPTER_1 = 'PublicCloud';

export const TRACKING_OCTAVIA_LOAD_BALANCERS_PREFIX =
  'pci::projects::project::octavia-loadbalancer';

export const TRACKING_PREFIX = `${TRACKING_CHAPTER_1}::${TRACKING_OCTAVIA_LOAD_BALANCERS_PREFIX}`;

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

export const AGORA_ADDON_FAMILY = 'octavia-loadbalancer';
export const SIZE_FLAVOUR_REGEX = /octavia-loadbalancer.loadbalancer-([sml]).hour.consumption/;
export const AGORA_FLOATING_IP_REGEX = /floatingip.floatingip.hour.consumption/;
export const NETWORK_PRIVATE_VISIBILITY = 'private';
export const FLOATING_IP_TYPE = {
  NO_IP: 'none',
  CREATE: 'create',
  IP: 'ip',
};

export const PRODUCT_LINK = {
  FR: 'https://www.ovhcloud.com/fr/public-cloud/load-balancer/',
  DE: 'https://www.ovhcloud.com/de/public-cloud/load-balancer/',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/load-balancer/',
  WE: 'https://www.ovhcloud.com/en-ie/public-cloud/load-balancer/',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/load-balancer/',
  IT: 'https://www.ovhcloud.com/it/public-cloud/load-balancer/',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/load-balancer/',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/load-balancer/',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/load-balancer/',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/load-balancer/',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/load-balancer/',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/load-balancer/',
  WS: 'https://www.ovhcloud.com/es/public-cloud/load-balancer/',
  MA: 'https://www.ovhcloud.com/fr-ma/public-cloud/load-balancer/',
  SN: 'https://www.ovhcloud.com/fr-sn/public-cloud/load-balancer/',
  TN: 'https://www.ovhcloud.com/fr-tn/public-cloud/load-balancer/',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/load-balancer/',
  SG: 'https://www.ovhcloud.com/en-sg/public-cloud/load-balancer/',
  ASIA: 'https://www.ovhcloud.com/asia/public-cloud/load-balancer/',
  US: 'https://us.ovhcloud.com/en/public-cloud/load-balancer/',
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/load-balancer/',
};

export const REGION_AVAILABILITY_LINK = {
  FR: 'https://www.ovhcloud.com/fr/public-cloud/regions-availability',
  DE: 'https://www.ovhcloud.com/de/public-cloud/regions-availability/',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/regions-availability/',
  WE: 'https://www.ovhcloud.com/en-ie/public-cloud/regions-availability/',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/regions-availability/',
  IT: 'https://www.ovhcloud.com/it/public-cloud/regions-availability/',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/regions-availability/',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/regions-availability/',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/regions-availability/',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/regions-availability/',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/regions-availability/',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/regions-availability/',
  WS: 'https://www.ovhcloud.com/es/public-cloud/regions-availability/',
  MA: 'https://www.ovhcloud.com/fr-ma/public-cloud/regions-availability/',
  SN: 'https://www.ovhcloud.com/fr-sn/public-cloud/regions-availability/',
  TN: 'https://www.ovhcloud.com/fr-tn/public-cloud/regions-availability/',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/regions-availability/',
  SG: 'https://www.ovhcloud.com/en-sg/public-cloud/regions-availability/',
  ASIA: 'https://www.ovhcloud.com/asia/public-cloud/regions-availability/',
  US: 'https://us.ovhcloud.com/public-cloud/regions-availability/',
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/regions-availability/',
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

export const GETTING_STARTED_LINK = {
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-network-getting-started-load-balancer?id=kb_article_view&sysparm_article=KB0050200',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-network-getting-started-load-balancer?id=kb_article_view&sysparm_article=KB0037842',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-network-getting-started-load-balancer?id=kb_article_view&sysparm_article=KB0050208',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-network-getting-started-load-balancer?id=kb_article_view&sysparm_article=KB0050193',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-network-getting-started-load-balancer?id=kb_article_view&sysparm_article=KB0050199',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-network-getting-started-load-balancer?id=kb_article_view&sysparm_article=KB0050201',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-network-getting-started-load-balancer?id=kb_article_view&sysparm_article=KB0050202',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-network-getting-started-load-balancer?id=kb_article_view&sysparm_article=KB0050203',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-network-getting-started-load-balancer?id=kb_article_view&sysparm_article=KB0050188',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-network-getting-started-load-balancer?id=kb_article_view&sysparm_article=KB0050196',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-network-getting-started-load-balancer?id=kb_article_view&sysparm_article=KB0050197',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-network-getting-started-load-balancer?id=kb_article_view&sysparm_article=KB0050198',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-network-getting-started-load-balancer?id=kb_article_view&sysparm_article=KB0050206',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-network-getting-started-load-balancer?id=kb_article_view&sysparm_article=KB0050195',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/18610207964051-Getting-Started-with-Load-Balancer-on-Public-Cloud',
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-network-getting-started-load-balancer?id=kb_article_view&sysparm_article=KB0050193',
};

export const MAX_LISTENER = 5;
export const MAX_INSTANCES_BY_LISTENER = 5;
export const LOAD_BALANCER_NAME_REGEX = /^[A-Za-z0-9_.-]+$/;
export const FLOATING_IP_CREATE_DESCRIPTION =
  'FIP created by OVHCloud Control Panel (Manager) for Load Balancer';
export const AGORA_GATEWAY_REGEX = /gateway.s.hour.consumption/;

export const TRACKING_NAME =
  'pci::projects::project::octavia-loadbalancer::add';
const TRACKING_ROOT = `PublicCloud::${TRACKING_NAME}`;
export const LOAD_BALANCER_CREATION_TRACKING = {
  ROOT: TRACKING_ROOT,
  GO_TO_PRODUCT_PAGE: `${TRACKING_ROOT}::goto-product-page`,
  GO_TO_REGION_AVAILABILITY: `${TRACKING_ROOT}::goto-region-availability`,
  CREATE_PRIVATE_NETWORK: `${TRACKING_ROOT}::create-private-network`,
  GO_TO_INSTANCE_DOCUMENTATION: `${TRACKING_ROOT}::goto-documentation`,
  CANCEL: `${TRACKING_ROOT}::cancel`,
  SUBMIT: `${TRACKING_ROOT}::confirm`,
  CONFIRM: `octavia-loadbalancer::confirm-creation`,
  ERROR: `${TRACKING_ROOT}-error`,
  SUCCESS: `${TRACKING_ROOT}-success`,
  FINISH_STEP_1: 'loadbalancer_octavia_add_size',
  FINISH_STEP_2: 'loadbalancer_octavia_add_region',
  FINISH_STEP_3: 'loadbalancer_octavia_add_ip',
  FINISH_STEP_4: 'loadbalancer_octavia_add_network',
  FINISH_STEP_5: 'loadbalancer_octavia_add_instances',
  SKIP_STEP_5: 'loadbalancer_octavia_add_instances_skip',
};

export const RULE_TYPES = {
  COOKIE: 'cookie',
  FILE_TYPE: 'fileType',
  HEADER: 'header',
  HOST_NAME: 'hostName',
  PATH: 'path',
  SSL_CONN_HAS_CERT: 'sslConnHasCert',
  SSL_VERIFY_RESULT: 'sslVerifyResult',
  SSL_DN_FIELD: 'sslDNField',
};

export const RULE_TYPES_LABELS = {
  [RULE_TYPES.COOKIE]: 'Cookie',
  [RULE_TYPES.FILE_TYPE]: 'File type',
  [RULE_TYPES.HEADER]: 'Header',
  [RULE_TYPES.HOST_NAME]: 'Host name',
  [RULE_TYPES.PATH]: 'Path',
  [RULE_TYPES.SSL_CONN_HAS_CERT]: 'SSL conn has cert',
  [RULE_TYPES.SSL_VERIFY_RESULT]: 'SSL verify result',
  [RULE_TYPES.SSL_DN_FIELD]: 'SSL DN field',
};

export const RULE_TYPES_LIST = [
  {
    value: RULE_TYPES.COOKIE,
    label: RULE_TYPES_LABELS[RULE_TYPES.COOKIE],
  },
  {
    value: RULE_TYPES.FILE_TYPE,
    label: RULE_TYPES_LABELS[RULE_TYPES.FILE_TYPE],
  },
  {
    value: RULE_TYPES.HEADER,
    label: RULE_TYPES_LABELS[RULE_TYPES.HEADER],
  },
  {
    value: RULE_TYPES.HOST_NAME,
    label: RULE_TYPES_LABELS[RULE_TYPES.HOST_NAME],
  },
  {
    value: RULE_TYPES.PATH,
    label: RULE_TYPES_LABELS[RULE_TYPES.PATH],
  },
  {
    value: RULE_TYPES.SSL_CONN_HAS_CERT,
    label: RULE_TYPES_LABELS[RULE_TYPES.SSL_CONN_HAS_CERT],
  },
  {
    value: RULE_TYPES.SSL_VERIFY_RESULT,
    label: RULE_TYPES_LABELS[RULE_TYPES.SSL_VERIFY_RESULT],
  },
  {
    value: RULE_TYPES.SSL_DN_FIELD,
    label: RULE_TYPES_LABELS[RULE_TYPES.SSL_DN_FIELD],
  },
];

export const RULE_COMPARE_TYPES = {
  REGEX: 'regex',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',
  CONTAINS: 'contains',
  EQUAL_TO: 'equalTo',
};

export const RULE_COMPARE_TYPES_LABELS = {
  [RULE_COMPARE_TYPES.REGEX]: 'Regex',
  [RULE_COMPARE_TYPES.STARTS_WITH]: 'Starts with',
  [RULE_COMPARE_TYPES.ENDS_WITH]: 'Ends with',
  [RULE_COMPARE_TYPES.CONTAINS]: 'Contains',
  [RULE_COMPARE_TYPES.EQUAL_TO]: 'Equal to',
};

export const RULE_COMPARE_TYPES_LIST = [
  {
    value: RULE_COMPARE_TYPES.REGEX,
    label: RULE_COMPARE_TYPES_LABELS[RULE_COMPARE_TYPES.REGEX],
  },
  {
    value: RULE_COMPARE_TYPES.STARTS_WITH,
    label: RULE_COMPARE_TYPES_LABELS[RULE_COMPARE_TYPES.STARTS_WITH],
  },
  {
    value: RULE_COMPARE_TYPES.ENDS_WITH,
    label: RULE_COMPARE_TYPES_LABELS[RULE_COMPARE_TYPES.ENDS_WITH],
  },
  {
    value: RULE_COMPARE_TYPES.CONTAINS,
    label: RULE_COMPARE_TYPES_LABELS[RULE_COMPARE_TYPES.CONTAINS],
  },
  {
    value: RULE_COMPARE_TYPES.EQUAL_TO,
    label: RULE_COMPARE_TYPES_LABELS[RULE_COMPARE_TYPES.EQUAL_TO],
  },
];

export const RULE_TYPES_WITH_KEY = [
  RULE_TYPES.COOKIE,
  RULE_TYPES.HEADER,
  RULE_TYPES.SSL_DN_FIELD,
];

export const COMPARE_TYPES_AVAILABILITY_BY_TYPE = {
  [RULE_TYPES.COOKIE]: RULE_COMPARE_TYPES_LIST,
  [RULE_TYPES.FILE_TYPE]: RULE_COMPARE_TYPES_LIST.filter(
    (type) =>
      type.value === RULE_COMPARE_TYPES.EQUAL_TO ||
      type.value === RULE_COMPARE_TYPES.REGEX,
  ),
  [RULE_TYPES.HEADER]: RULE_COMPARE_TYPES_LIST,
  [RULE_TYPES.HOST_NAME]: RULE_COMPARE_TYPES_LIST,
  [RULE_TYPES.PATH]: RULE_COMPARE_TYPES_LIST,
  [RULE_TYPES.SSL_CONN_HAS_CERT]: RULE_COMPARE_TYPES_LIST.filter(
    (type) => type.value === RULE_COMPARE_TYPES.EQUAL_TO,
  ),
  [RULE_TYPES.SSL_VERIFY_RESULT]: RULE_COMPARE_TYPES_LIST.filter(
    (type) => type.value === RULE_COMPARE_TYPES.EQUAL_TO,
  ),
  [RULE_TYPES.SSL_DN_FIELD]: RULE_COMPARE_TYPES_LIST,
};

export const VALUE_REGEX_BY_TYPE = {
  [RULE_TYPES.COOKIE]: "^[a-zA-Z0-9!#$%&'()*+-./:<=>?@[\\]^_`{|}~]+$",
  [RULE_TYPES.FILE_TYPE]:
    '^[a-zA-Z0-9!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}\\\\~]+$',
  [RULE_TYPES.HEADER]: '^[a-zA-Z0-9!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}\\\\~]+$',
  [RULE_TYPES.HOST_NAME]:
    '^[a-zA-Z0-9!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}\\\\~]+$',
  [RULE_TYPES.PATH]: '^[a-zA-Z0-9!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}\\\\~]+$',
  [RULE_TYPES.SSL_CONN_HAS_CERT]: '^True$',
  [RULE_TYPES.SSL_VERIFY_RESULT]: '^[0-9]+$',
  [RULE_TYPES.SSL_DN_FIELD]: '',
};

export const KEY_REGEX = "^[a-zA-Z0-9!#$%&'*+-.^_`|~]+$";

export const REGEX = {
  ip: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
};
