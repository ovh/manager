import {
  TRACKING_PREFIX,
  ALERT_ID,
  ADDITIONAL_IP,
  IP_FAILOVER_PLANCODE,
} from '../ip-ip-agoraOrder.constant';

export const FETCH_PRICE_MAX_TRIES = 5;

export const PRODUCT_TYPES = {
  dedicatedServer: {
    apiTypeName: 'SERVER',
    typeName: 'DEDICATED',
  },
  privateCloud: {
    apiTypeName: 'DEDICATED_CLOUD',
    typeName: 'PRIVATE_CLOUD',
  },
  vps: {
    apiTypeName: 'VPS',
    typeName: 'VPS',
  },
  parking: {
    apiTypeName: 'parking',
    typeName: 'parking',
  },
  vrack: {
    apiTypeName: 'VRACK',
    typeName: 'VRACK',
  },
};

export const IP_AGORA = {
  IPv4Failover: {
    typeName: 'IPv4Failover',
    maxQty: 64,
    minQty: 1,
  },
  IPv4Block: {
    typeName: 'IPv4Block',
    maxQty: 1,
    minQty: 1,
  },
};

export const IP_LOCATION_GROUPS = [
  {
    labels: ['APAC/CANADA', 'CANADA - ASIA'],
    countries: ['au', 'ca', 'sg', 'in'],
  },
  {
    labels: ['EUROPE'],
    countries: [
      'be',
      'cz',
      'de',
      'es',
      'fi',
      'fr',
      'gb',
      'ie',
      'it',
      'lt',
      'nl',
      'pl',
      'pt',
      'uk',
    ],
  },
  { labels: ['USA'], countries: ['us'] },
];

export const VPS_MAX_QUANTITY = 16;
export const BLOCK_ADDITIONAL_IP = 'Block Additional IP';

export { TRACKING_PREFIX, ADDITIONAL_IP, ALERT_ID, IP_FAILOVER_PLANCODE };

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

export const IP_LOCATION_GROUPS_BASED_ON_DATACENTER = [
  {
    labels: ['APAC/CANADA', 'CANADA - ASIA'],
    countries: ['au', 'ca', 'sg', 'in'],
    datacenter: ['SYD', 'BHS', 'YYZ', 'YNM', 'SGP'],
  },
  {
    labels: ['EUROPE'],
    countries: ['de', 'fr', 'pl', 'uk'],
    datacenter: ['RBX', 'GRA', 'LIM', 'CR2', 'PAR', 'SBG', 'WAW', 'ERI'],
  },
  { labels: ['USA'], countries: ['us'], datacenter: ['HIL', 'VIN'] },
];

/* To be replaced once we have region list coming from API for the Vrack, as of now consider IPV6 regions */
export const REGION_TO_DATACENTER = {
  'eu-west-rbx': 'RBX',
  'eu-west-gra': 'GRA',
  'eu-west-sbg': 'SBG',
  'eu-west-par': 'PAR',
  'labeu-west-1-preprod': 'CR2',
  'eu-west-lim': 'LIM',
  'eu-central-waw': 'WAW',
  'eu-west-eri': 'ERI',
  'ca-east-bhs': 'BHS',
  'ca-east-tor': 'YYZ',
  'ap-southeast-sgp': 'SGP',
  'ap-southeast-syd': 'SYD',
  'ap-south-mum': 'YNM',
  'us-east-vin': 'VIN',
  'us-west-hil': 'HIL',
};

export default {
  FETCH_PRICE_MAX_TRIES,
  IP_LOCATION_GROUPS,
  PRODUCT_TYPES,
  TRACKING_PREFIX,
  VPS_MAX_QUANTITY,
  IP_AGORA,
  IP_FAILOVER_PLANCODE,
  BLOCK_ADDITIONAL_IP,
  ALERT_ID,
  DATACENTER_TO_COUNTRY,
  DATACENTER_TO_REGION,
  IP_LOCATION_GROUPS_BASED_ON_DATACENTER,
  REGION_TO_DATACENTER,
};
