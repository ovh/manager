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

export const PRISM_CENTRAL_SIZE_XL = 'xlarge';
export const PRISM_CENTRAL_SIZE_L = 'large';
export const PRISM_CENTRAL_SIZE_S = 'small';
export const PRISM_CENTRAL_SIZE_XS = 'xsmall';

export const PRISM_CENTRAL_SIZES = [
  { label: 'XLarge', value: PRISM_CENTRAL_SIZE_XL },
  { label: 'Large', value: PRISM_CENTRAL_SIZE_L },
  { label: 'Small', value: PRISM_CENTRAL_SIZE_S },
  { label: 'Tiny', value: PRISM_CENTRAL_SIZE_XS },
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
  PRISM_CENTRAL_SIZES,
  IPV4_REGEX,
  IPV4_BLOCK_REGEX,
};
