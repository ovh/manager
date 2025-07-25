import {
  PREFIX_TRACKING_NUTANIX_NUTANIX,
  PREFIX_TRACKING_NUTANIX_POPUP,
} from '../../constants';

export const TRAVAUX_LINK = {
  US: 'https://status.us.ovhcloud.com/',
  DEFAULT: 'https://www.status-ovhcloud.com/',
};

export const GUIDES_URL = {
  CA: 'https://www.ovhcloud.com/en-ca/hosted-private-cloud/nutanix/',
  QC: 'https://www.ovhcloud.com/fr-ca/hosted-private-cloud/nutanix/',
  DE: 'https://www.ovhcloud.com/de/hosted-private-cloud/nutanix/',
  ES: 'https://www.ovhcloud.com/es-es/hosted-private-cloud/nutanix/',
  FR: 'https://www.ovhcloud.com/fr/hosted-private-cloud/nutanix/',
  GB: 'https://www.ovhcloud.com/en-gb/hosted-private-cloud/nutanix/',
  IE: 'https://www.ovhcloud.com/en-ie/hosted-private-cloud/nutanix/',
  IT: 'https://www.ovhcloud.com/it/hosted-private-cloud/nutanix/',
  NL: 'https://www.ovhcloud.com/nl/hosted-private-cloud/nutanix/',
  PL: 'https://www.ovhcloud.com/pl/hosted-private-cloud/nutanix/',
  PT: 'https://www.ovhcloud.com/pt/hosted-private-cloud/nutanix/',
  MA: 'https://www.ovhcloud.com/fr-ma/hosted-private-cloud/nutanix/',
  SN: 'https://www.ovhcloud.com/fr-sn/hosted-private-cloud/nutanix/',
  TN: 'https://www.ovhcloud.com/fr-tn/hosted-private-cloud/nutanix/',
  WS: 'https://www.ovhcloud.com/es/hosted-private-cloud/nutanix/',
  US: 'https://us.ovhcloud.com/hosted-private-cloud/nutanix/',
  DEFAULT: 'https://www.ovhcloud.com/en-gb/hosted-private-cloud/nutanix/',
};

export const PRIVATE_BANDWIDTH_SERVICE_PREFIX = 'cluster-vrack-bandwidth';

export const REPLICATION_FACTOR_PREFIX = 'RF';

export const GENERAL_INFO_TILE_TITLE = {
  FAULT_TOLENRANCE_DOMAIN: 'Fault Tolerance Domain',
  REPLICATION_FACTOR: 'Replication Factor',
};

export const NUTANIX_PERSONAL_LICENSE_EDITION = 'Personal license';
export const NUTANIX_BYOL = 'BYOL';

export const FEATURES = {
  PACK_TYPE: 'nutanix:pack-type',
};

export const LEGACY_PACK_TYPES = ['Standard', 'Advanced'];

const TRACKING_PREFIX = 'hpc::nutanix::cluster';

export const TRACKING = {
  DASHBOARD: `${PREFIX_TRACKING_NUTANIX_NUTANIX}::dashboard::general-information`,
  REDEPLOY_CLUSTER: `${TRACKING_PREFIX}::redeploy-cluster`,
  ACCESS_PRISM: `${TRACKING_PREFIX}::access-prism-central`,
  ACCESS_NUTANIX: `${TRACKING_PREFIX}::link-nutanix-website`,
  DASHBOARD_ADD_NODE: `${PREFIX_TRACKING_NUTANIX_POPUP}::general-information::order-nodes`,
};

export default {
  TRAVAUX_LINK,
  PRIVATE_BANDWIDTH_SERVICE_PREFIX,
  REPLICATION_FACTOR_PREFIX,
  NUTANIX_PERSONAL_LICENSE_EDITION,
  GENERAL_INFO_TILE_TITLE,
  FEATURES,
  TRACKING,
  GUIDES_URL,
  LEGACY_PACK_TYPES,
};
