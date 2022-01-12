export const TRACKING_PREFIX = 'hpc::nutanix::cluster::redeploy';

export const REDEPLOY_INITIAL_CONFIG = 'redeployInitialConfig';

export const REDEPLOY_CUSTOM_CONFIG = 'redeployCustomConfig';

export const PRISM_CENTRAL_TYPES = ['alone', 'scale'];

export const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export const IPV4_BLOCK_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/([0-9]|[1-2][0-9]|3[0-2])?$/;

export default {
  TRACKING_PREFIX,
  REDEPLOY_INITIAL_CONFIG,
  REDEPLOY_CUSTOM_CONFIG,
  PRISM_CENTRAL_TYPES,
  IPV4_REGEX,
  IPV4_BLOCK_REGEX,
};
