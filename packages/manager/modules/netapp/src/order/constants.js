export const SIZE_MULTIPLE = 8;

// API expresses sizes in GB but we want TB
export const SIZE_FACTOR = 1000;

export const REGION_LABEL = 'region';

// Private connectivity via our vRack service is not compatible with below regions.
export const IN_COMPATIBLE_REGION = ['BHS', 'SBG'];

export default {
  SIZE_MULTIPLE,
  SIZE_FACTOR,
  REGION_LABEL,
  IN_COMPATIBLE_REGION,
};
