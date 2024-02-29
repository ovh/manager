export const TRAVAUX_LINK = {
  US: 'https://status.us.ovhcloud.com/',
  DEFAULT: 'https://www.status-ovhcloud.com/',
};

export const GUIDE_PACKAGES_URL = {
  CA: 'https://www.ovhcloud.com/en-ca/hosted-private-cloud/nutanix/packaged',
  QC: 'https://www.ovhcloud.com/fr-ca/hosted-private-cloud/nutanix/packaged',
  DE: 'https://www.ovhcloud.com/de/hosted-private-cloud/nutanix/packaged',
  ES: 'https://www.ovhcloud.com/es-es/hosted-private-cloud/nutanix/packaged',
  FR: 'https://www.ovhcloud.com/fr/hosted-private-cloud/nutanix/packaged',
  GB: 'https://www.ovhcloud.com/en-gb/hosted-private-cloud/nutanix/packaged',
  IE: 'https://www.ovhcloud.com/en-ie/hosted-private-cloud/nutanix/packaged',
  IT: 'https://www.ovhcloud.com/it/hosted-private-cloud/nutanix/packaged',
  NL: 'https://www.ovhcloud.com/nl/hosted-private-cloud/nutanix/packaged',
  PL: 'https://www.ovhcloud.com/pl/hosted-private-cloud/nutanix/packaged',
  PT: 'https://www.ovhcloud.com/pt/hosted-private-cloud/nutanix/packaged',
  MA: 'https://www.ovhcloud.com/fr-ma/hosted-private-cloud/nutanix/packaged',
  SN: 'https://www.ovhcloud.com/fr-sn/hosted-private-cloud/nutanix/packaged',
  TN: 'https://www.ovhcloud.com/fr-tn/hosted-private-cloud/nutanix/packaged',
  WS: 'https://www.ovhcloud.com/es/hosted-private-cloud/nutanix/packaged',
  US: 'https://us.ovhcloud.com/hosted-private-cloud/nutanix/packaged',
  DEFAULT:
    'https://www.ovhcloud.com/en-gb/hosted-private-cloud/nutanix/packaged',
};

export const PRIVATE_BANDWIDTH_SERVICE_PREFIX = 'cluster-vrack-bandwidth';

export const REPLICATION_FACTOR_PREFIX = 'RF';

export const GENERAL_INFO_TILE_TITLE = {
  FAULT_TOLENRANCE_DOMAIN: 'Fault Tolerance Domain',
  REPLICATION_FACTOR: 'Replication Factor',
};

export const NUTANIX_PERSONAL_LICENSE_EDITION = 'Personal license';

export const FEATURES = {
  PACK_TYPE: 'nutanix:pack-type',
};

const TRACKING_PREFIX = 'hpc::nutanix::cluster';

export const TRACKING = {
  DASHBOARD: `${TRACKING_PREFIX}::dahboard`,
  REDEPLOY_CLUSTER: `${TRACKING_PREFIX}::redeploy-cluster`,
  ACCESS_PRISM: `${TRACKING_PREFIX}::access-prism-central`,
  ACCESS_NUTANIX: `${TRACKING_PREFIX}::link-nutanix-website`,
};

export default {
  TRAVAUX_LINK,
  PRIVATE_BANDWIDTH_SERVICE_PREFIX,
  REPLICATION_FACTOR_PREFIX,
  NUTANIX_PERSONAL_LICENSE_EDITION,
  GENERAL_INFO_TILE_TITLE,
  FEATURES,
  TRACKING,
};
