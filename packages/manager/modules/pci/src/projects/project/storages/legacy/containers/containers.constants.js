export const OBJECT_CONTAINER_OFFER_SWIFT = 'storage';
export const OBJECT_CONTAINER_OFFER_HIGH_PERFORMANCE = 'storage-s3-high-perf';
export const OBJECT_CONTAINER_OFFERS = [
  OBJECT_CONTAINER_OFFER_SWIFT,
  OBJECT_CONTAINER_OFFER_HIGH_PERFORMANCE,
];
export const OBJECT_CONTAINER_TYPE_OFFERS = [OBJECT_CONTAINER_OFFER_SWIFT];

export const STORAGES_CONTAINER_NAME_PATTERN = /^[a-z0-9]([a-z0-9.-]{1,61})[a-z0-9]$/;

export const OBJECT_CONTAINER_NAME_PATTERN = {
  [OBJECT_CONTAINER_OFFER_HIGH_PERFORMANCE]: STORAGES_CONTAINER_NAME_PATTERN,
};

export const OBJECT_CONTAINER_TYPE_STATIC = 'static';
export const OBJECT_CONTAINER_TYPE_PRIVATE = 'private';
export const OBJECT_CONTAINER_TYPE_PUBLIC = 'public';
export const OBJECT_CONTAINER_TYPES = [
  OBJECT_CONTAINER_TYPE_STATIC,
  OBJECT_CONTAINER_TYPE_PRIVATE,
  OBJECT_CONTAINER_TYPE_PUBLIC,
];

export const OBJECT_TYPE_SEALED = 'sealed';
export const OBJECT_TYPE_UNSEALING = 'unsealing';
export const OBJECT_TYPE_UNSEALED = 'unsealed';
export const OBJECT_TYPE_PCA = 'pca';
export const OBJECT_TYPES = [
  OBJECT_TYPE_SEALED,
  OBJECT_TYPE_UNSEALING,
  OBJECT_TYPE_UNSEALED,
  OBJECT_TYPE_PCA,
];

export const CLOUD_PCA_FILE_STATE = {
  SEALED: 'sealed',
  UNSEALING: 'unsealing',
  UNSEALED: 'unsealed',
};

export const CONTAINER_DEFAULT_USER = 'pca';

export const CONTAINER_DEFAULT_PASSWORD_TENANTNAME = '$OS_TENANT_NAME';
export const CONTAINER_DEFAULT_PASSWORD_USERNAME = '$OS_USERNAME';
export const CONTAINER_DEFAULT_PASSWORD_PASSWORD = '$OS_PASSWORD';
export const CONTAINER_DEFAULT_PASSWORD = [
  CONTAINER_DEFAULT_PASSWORD_TENANTNAME,
  CONTAINER_DEFAULT_PASSWORD_USERNAME,
  CONTAINER_DEFAULT_PASSWORD_PASSWORD,
].join('.');
export const CONTAINER_COMMERCIAL_NAME = 'storage-replicated';

export const PUBLIC_CLOUD_PRODUCT_NAME = 'cloud';

export const STORAGE_GATEWAY = {
  CA: 'gateways.storage.REGION.cloud.ovh.net',
  EU: 'gateways.storage.REGION.cloud.ovh.net',
  US: 'gateways.storage.REGION.cloud.ovh.us',
};

export const STORAGE_PRICES_LINK = {
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/prices/#storage',
  DE: 'https://www.ovhcloud.com/de/public-cloud/prices/#storage',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/prices/#storage',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/prices/#storage',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/prices/#storage',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/prices/#storage',
  SG: 'https://www.ovhcloud.com/en-sg/public-cloud/prices/#storage',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/prices/#storage',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/prices/#storage',
  FR: 'https://www.ovhcloud.com/fr/public-cloud/prices/#storage',
  MA: 'https://www.ovhcloud.com/fr-ma/public-cloud/prices/#storage',
  SN: 'https://www.ovhcloud.com/fr-sn/public-cloud/prices/#storage',
  TN: 'https://www.ovhcloud.com/fr-tn/public-cloud/prices/#storage',
  IT: 'https://www.ovhcloud.com/it/public-cloud/prices/#storage',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/prices/#storage',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/prices/#storage',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/prices/#armazenamento',
  WS: 'https://www.ovhcloud.com/es/public-cloud/prices/#storage',
  WE: 'https://www.ovhcloud.com/en/public-cloud/prices/#storage',
};

export const X_CONTAINER_HEADERS_REGEX = /^(X-Container|X-Storage)/i;

export const X_AUTH_TOKEN = 'X-Auth-Token';
export const X_STORAGE_POLICY = 'x-storage-policy';
export const X_CONTAINER_READ = 'x-container-read';
export const X_CONTAINER_META_WEB_LISTINGS = 'x-container-meta-web-listings';
export const X_CONTAINER_READ_PUBLIC_VALUE = '.r:*,.rlistings';
export const OPENIO_DEFAULT_REGION = 'SBG';

export const OPENIO_PRESIGN_EXPIRE = 3600;

export default {
  STORAGES_CONTAINER_NAME_PATTERN,

  OBJECT_CONTAINER_OFFER_SWIFT,
  OBJECT_CONTAINER_OFFER_HIGH_PERFORMANCE,
  OBJECT_CONTAINER_OFFERS,
  OBJECT_CONTAINER_TYPE_OFFERS,

  CONTAINER_DEFAULT_USER,
  CONTAINER_DEFAULT_PASSWORD_TENANTNAME,
  CONTAINER_DEFAULT_PASSWORD_USERNAME,
  CONTAINER_DEFAULT_PASSWORD_PASSWORD,
  CONTAINER_DEFAULT_PASSWORD,
  CONTAINER_COMMERCIAL_NAME,

  OBJECT_CONTAINER_TYPES,

  OBJECT_TYPE_SEALED,
  OBJECT_TYPE_UNSEALING,
  OBJECT_TYPE_UNSEALED,
  OBJECT_TYPE_PCA,
  OBJECT_TYPES,

  OPENIO_DEFAULT_REGION,
  OPENIO_PRESIGN_EXPIRE,

  PUBLIC_CLOUD_PRODUCT_NAME,

  STORAGE_GATEWAY,
  STORAGE_PRICES_LINK,

  X_AUTH_TOKEN,
  X_CONTAINER_HEADERS_REGEX,
  X_CONTAINER_META_WEB_LISTINGS,
  X_CONTAINER_READ,
  X_CONTAINER_READ_PUBLIC_VALUE,
  X_STORAGE_POLICY,
};
