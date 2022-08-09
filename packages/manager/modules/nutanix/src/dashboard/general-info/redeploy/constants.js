export const TRACKING_PREFIX = 'hpc::nutanix::cluster::redeploy';

export const REDEPLOY_CONFIG_OPTIONS = {
  INITIAL: 'redeployInitialConfig',
  CUSTOM: 'redeployCustomConfig',
};

export const PRISM_CENTRAL_TYPE_ALONE = 'alone';

export const PRISM_CENTRAL_TYPE_SCALE = 'scale';

export const PRISM_CENTRAL_TYPES = [
  PRISM_CENTRAL_TYPE_ALONE,
  PRISM_CENTRAL_TYPE_SCALE,
];

export const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export const IPV4_BLOCK_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|[1-2][0-9]|3[0-2])?$/;

export const IP_FOR_SCALE_REDEPLOY = 3;

export default {
  TRACKING_PREFIX,
  REDEPLOY_CONFIG_OPTIONS,
  PRISM_CENTRAL_TYPE_ALONE,
  PRISM_CENTRAL_TYPE_SCALE,
  PRISM_CENTRAL_TYPES,
  IPV4_REGEX,
  IPV4_BLOCK_REGEX,
};
