export const SIZE_MULTIPLE = 8;

// API expresses sizes in GB but we want TB
export const SIZE_FACTOR = 1000;

export const REGION_LABEL = 'region';
export const NETWORK_LABEL = 'network';

// Private connectivity via our vRack service is not compatible with below regions.
export const IN_COMPATIBLE_REGION = ['BHS', 'SBG'];

export const REGION_TO_COUNTRY = {
  'eu-west-par': 'fr',
  'eu-west-gra': 'fr',
  'eu-west-sbg': 'fr',
  'eu-west-lim': 'de',
  'eu-central-waw': 'pl',
  'eu-west-eri': 'gb',
  'us-east-vin': 'us',
  'us-west-hil': 'us',
  'ca-east-bhs': 'ca',
  'ap-southeast-sgp': 'sg',
  'ap-southeast-syd': 'au',
  'eu-west-rbx': 'fr',
  'ca-east-tor': 'ca',
  'ap-south-mum': 'in',
  'labeu-west-1-preprod': 'fr',
};

export const LICENSE_TYPE = {
  Premium: 'Premium',
  Standard: 'Standard',
  Extreme: 'Ultra',
};

export default {
  SIZE_MULTIPLE,
  SIZE_FACTOR,
  REGION_LABEL,
};
