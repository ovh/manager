export const PRODUCT_ID = 'nutanixPreprod';
export const DEFAULT_OS_NODE_NUTANIX = 'none_64.en';

export const NOT_SUBSCRIBED = 'notSubscribed';
export const SERVER_OPTIONS = {
  BANDWIDTH: 'BANDWIDTH',
  BANDWIDTH_VRACK: 'BANDWIDTH_VRACK',
};
export const CLUSTER_STATUS = {
  ACTIVE: 'active',
  DEPLOYING: 'deploying',
  ERROR: 'error',
};

export const NODE_STATUS = {
  DEPLOYED: 'deployed',
  DEPLOYING: 'deploying',
  DEPLOY_CANCELLED: 'deploy_cancelled',
  DEPLOY_FAILURE: 'deploy_failure',
  UNDEPLOYED: 'undeployed',
  UNDEPLOYING: 'undeploying',
  UNDEPLOY_CANCELLED: 'undeploy_cancelled',
  UNDEPLOY_FAILURE: 'undeploy_failure',
  UNKNOWN: 'unknown',
};

export const NODE_POWER_STATES = {
  POWEROFF: 'poweroff',
};

export const SERVICE_STATES = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  TO_SUSPEND: 'toSuspend',
  UNKNOWN: 'unknown',
};

export const MIN_NODES_BY_CLUSTER = 3;
export const MAX_NODES_BY_CLUSTER = 15;

export const NUTANIX_SERVICE_TYPE = 'NUTANIX';

export const NUTANIX_ORDER_URL = {
  CA: 'https://www.ovhcloud.com/en-ca/hosted-private-cloud/nutanix/',
  QC: 'https://www.ovhcloud.com/fr-ca/hosted-private-cloud/nutanix/',
  CZ: 'https://www.ovhcloud.com/en-ie/hosted-private-cloud/nutanix/',
  DE: 'https://www.ovhcloud.com/de/hosted-private-cloud/nutanix/',
  ES: 'https://www.ovhcloud.com/es-es/hosted-private-cloud/nutanix/',
  FI: 'https://www.ovhcloud.com/en-ie/hosted-private-cloud/nutanix/',
  FR: 'https://www.ovhcloud.com/fr/hosted-private-cloud/nutanix/',
  GB: 'https://www.ovhcloud.com/en-gb/hosted-private-cloud/nutanix/',
  IE: 'https://www.ovhcloud.com/en-ie/hosted-private-cloud/nutanix/',
  IT: 'https://www.ovhcloud.com/it/hosted-private-cloud/nutanix/',
  LT: 'https://www.ovhcloud.com/en-ie/hosted-private-cloud/nutanix/',
  NL: 'https://www.ovhcloud.com/nl/hosted-private-cloud/nutanix/',
  PL: 'https://www.ovhcloud.com/pl/hosted-private-cloud/nutanix/',
  PT: 'https://www.ovhcloud.com/pt/hosted-private-cloud/nutanix/',
  MA: 'https://www.ovhcloud.com/fr-ma/hosted-private-cloud/nutanix/',
  SN: 'https://www.ovhcloud.com/fr-sn/hosted-private-cloud/nutanix/',
  TN: 'https://www.ovhcloud.com/fr-tn/hosted-private-cloud/nutanix/',
  WE: 'https://www.ovhcloud.com/en/hosted-private-cloud/nutanix/',
  WS: 'https://www.ovhcloud.com/es/hosted-private-cloud/nutanix/',
  US: 'https://us.ovhcloud.com/contact-sales/',
  DEFAULT: 'https://www.ovhcloud.com/en/hosted-private-cloud/nutanix/',
};

export function getNutanixOrderUrl(subsidiary) {
  return NUTANIX_ORDER_URL[subsidiary] || NUTANIX_ORDER_URL.DEFAULT;
}

export const IAM_RESOURCE_SERVICES_PREFIX = ':resource:account:';
export const IAM_ACTION_SERVICES = [
  'account:apiovh:services/get',
  'account:apiovh:services/options/get',
  'account:apiovh:services/technicalDetails/get',
];
export const IAM_ACTION_SUPPORT = ['account:apiovh:support/tickets/get'];

export const NUTANIX_AUTHORIZATION_TYPE = {
  SERVICES: 'SERVICES',
  SUPPORT: 'SUPPORT',
};

export const NUTANIX_GUIDE_LINK =
  'https://portal.nutanix.com/page/documents/list?type=software';

export default {
  NUTANIX_GUIDE_LINK,
  NODE_POWER_STATES,
  SERVICE_STATES,
  PRODUCT_ID,
  DEFAULT_OS_NODE_NUTANIX,
  NUTANIX_ORDER_URL,
  CLUSTER_STATUS,
  NODE_STATUS,
  NOT_SUBSCRIBED,
  SERVER_OPTIONS,
  NUTANIX_SERVICE_TYPE,
  MAX_NODES_BY_CLUSTER,
};
