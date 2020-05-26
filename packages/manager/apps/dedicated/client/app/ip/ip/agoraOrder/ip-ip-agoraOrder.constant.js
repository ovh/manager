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
};

export const IP_LOCATION_GROUPS = [
  { label: 'CANADA', countries: ['ca'] },
  {
    label: 'EUROPE',
    countries: [
      'au',
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
      'sg',
      'uk',
    ],
  },
  { label: 'USA', countries: ['us'] },
];

export default {
  FETCH_PRICE_MAX_TRIES,
  IP_LOCATION_GROUPS,
  PRODUCT_TYPES,
};
