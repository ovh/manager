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

export default {
  FETCH_PRICE_MAX_TRIES,
  PRODUCT_TYPES,
};
