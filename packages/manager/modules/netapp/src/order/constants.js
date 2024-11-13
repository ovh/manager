export const SIZE_MULTIPLE = 8;

// API expresses sizes in GB but we want TB
export const SIZE_FACTOR = 1000;

export const REGION_LABEL = 'region';

// Private connectivity via our vRack service is not compatible with below regions.
export const IN_COMPATIBLE_REGION = ['BHS', 'SBG'];

export const DATACENTER_TO_COUNTRY = {
  PAR: 'fr',
  GRA: 'fr',
  SBG: 'fr',
  LIM: 'de',
  WAW: 'pl',
  ERI: 'uk',
  VIN: 'us',
  HIL: 'us',
  BHS: 'ca',
  SGP: 'sg',
  SYD: 'au',
  RBX: 'fr',
  YYZ: 'ca',
  YNM: 'in',
  CR2: 'fr',
};

export const DATACENTER_TO_REGION = {
  RBX: 'eu-west-rbx',
  GRA: 'eu-west-gra',
  SBG: 'eu-west-sbg',
  PAR: 'eu-west-par',
  CR2: 'labeu-west-1-preprod',
  LIM: 'eu-west-lim',
  WAW: 'eu-central-waw',
  ERI: 'eu-west-eri',
  BHS: 'ca-east-bhs',
  YYZ: 'ca-east-tor',
  SGP: 'ap-southeast-sgp',
  SYD: 'ap-southeast-syd',
  YNM: 'ap-south-mum',
  VIN: 'us-east-vin',
  HIL: 'us-west-hil',
};

export default {
  SIZE_MULTIPLE,
  SIZE_FACTOR,
  REGION_LABEL,
  IN_COMPATIBLE_REGION,
};
