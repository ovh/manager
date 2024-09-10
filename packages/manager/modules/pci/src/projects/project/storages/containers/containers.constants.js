export const OBJECT_CONTAINER_OFFER_SWIFT = 'storage';
export const OBJECT_CONTAINER_OFFER_STORAGE_STANDARD = 'storage-s3-standard';
export const OBJECT_CONTAINER_OFFER_HIGH_PERFORMANCE = 'storage-s3-high-perf';
export const OBJECT_CONTAINER_S3_STATIC_URL_INFO = 'Virtual Hosted-Style :';

export const OBJECT_CONTAINER_MODE_MULTI_ZONES = 'region-multizones';
export const OBJECT_CONTAINER_MODE_MONO_ZONE = 'region';
export const OBJECT_CONTAINER_OFFERS_TYPES = {
  SWIFT: 'swift',
  S3: 's3',
};
export const OBJECT_CONTAINER_STORAGE_CLASS = {
  STANDARD: 'STANDARD',
  HIGH_PERFORMANCE: 'HIGH_PERF',
};
export const OBJECT_CONTAINER_OFFERS = [
  OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  OBJECT_CONTAINER_OFFER_SWIFT,
];
export const OBJECT_CONTAINER_OFFERS_LABELS = {
  [OBJECT_CONTAINER_OFFER_SWIFT]: { beta: false, new: false },
  [OBJECT_CONTAINER_OFFER_STORAGE_STANDARD]: { beta: false, new: true },
};

export const OBJECT_CONTAINER_DEPLOIMENT_MODES_LABELS = {
  [OBJECT_CONTAINER_MODE_MULTI_ZONES]: {
    beta: false,
    new: false,
    isMultiZone: true,
  },
  [OBJECT_CONTAINER_MODE_MONO_ZONE]: {
    beta: false,
    new: false,
    isMultiZone: false,
  },
};

export const OBJECT_CONTAINER_DEPLOIMENT_MODES = [
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
  OBJECT_CONTAINER_MODE_MONO_ZONE,
];

export const OBJECT_CONTAINER_DEPLOIMENT_MODE_TYPES = {
  MULTI_ZONES: 'region-multizones',
  MONO_ZONE: 'region',
};

export const OBJECT_CONTAINER_TYPE_OFFERS = [OBJECT_CONTAINER_OFFER_SWIFT];

export const STORAGES_CONTAINER_NAME_PATTERN = /^[a-z0-9]([a-z0-9.-]{1,61})[a-z0-9]$/;

export const OBJECT_CONTAINER_NAME_PATTERN = {
  [OBJECT_CONTAINER_OFFER_STORAGE_STANDARD]: STORAGES_CONTAINER_NAME_PATTERN,
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
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/prices/#439',
  ASIA: 'https://www.ovhcloud.com/asia/public-cloud/prices/#439',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/prices/#439',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/prices/#439',
  DE: 'https://www.ovhcloud.com/de/public-cloud/prices/#439',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/prices/#439',
  EU: 'https://www.ovhcloud.com/en-ie/public-cloud/prices/#439',
  FR: 'https://www.ovhcloud.com/fr/public-cloud/prices/#439',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/prices/#439',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/prices/#439',
  IN: 'https://www.ovhcloud.com/en-in/public-cloud/prices/#439',
  IT: 'https://www.ovhcloud.com/it/public-cloud/prices/#439',
  MA: 'https://www.ovhcloud.com/fr/public-cloud/prices/#439',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/prices/#439',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/prices/#439',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/prices/#439',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/prices/#439',
  SG: 'https://www.ovhcloud.com/en-sg/public-cloud/prices/#439',
  SN: 'https://www.ovhcloud.com/fr/public-cloud/prices/#439',
  TN: 'https://www.ovhcloud.com/fr/public-cloud/prices/#439',
  US: 'https://us.ovhcloud.com/public-cloud/prices/#439',
  WE: 'https://www.ovhcloud.com/en/public-cloud/prices/#439',
  WS: 'https://www.ovhcloud.com/es/public-cloud/prices/#439',
};

export const X_CONTAINER_HEADERS_REGEX = /^(X-Container|X-Storage)/i;

export const X_AUTH_TOKEN = 'X-Auth-Token';
export const X_STORAGE_POLICY = 'x-storage-policy';
export const X_AMZ_STORAGE_CLASS = 'X-Amz-Storage-Class';
export const X_CONTAINER_READ = 'x-container-read';
export const X_CONTAINER_META_WEB_LISTINGS = 'x-container-meta-web-listings';
export const X_CONTAINER_READ_PUBLIC_VALUE = '.r:*,.rlistings';
export const OPENIO_DEFAULT_REGION = 'SBG';

export const OPENIO_PRESIGN_EXPIRE = 3600;

export const CONTAINER_GUIDES = [
  {
    id: 'rclone',
    links: {
      DEFAULT: 'https://docs.ovh.com/gb/en/storage/sync-rclone-object-storage/',
      FR: 'https://docs.ovh.com/fr/storage/sync-rclone-object-storage/',
      DE: 'https://docs.ovh.com/de/storage/sync-Rclone-object-storage/',
      GB: 'https://docs.ovh.com/gb/en/storage/sync-rclone-object-storage/',
      CA: 'https://docs.ovh.com/ca/en/storage/sync-rclone-object-storage/',
      ES: 'https://docs.ovh.com/es/storage/sync-rclone-object-storage/',
      IT: 'https://docs.ovh.com/it/storage/sync-rclone-object-storage/',
      PT: 'https://docs.ovh.com/pt/storage/sync-rclone-object-storage/',
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/4605024491667-How-to-Back-Up-Your-Files-to-S3-Object-Storage-with-Rclone',
    },
    link: '',
  },
  {
    id: 'veeam',
    links: {
      DEFAULT: 'https://docs.ovh.com/gb/en/storage/s3/veeam/',
      FR: 'https://docs.ovh.com/fr/storage/s3/veeam/',
      DE: 'https://docs.ovh.com/de/storage/s3/veeam/',
      GB: 'https://docs.ovh.com/gb/en/storage/s3/veeam/',
      CA: 'https://docs.ovh.com/ca/en/storage/s3/veeam/',
      ES: 'https://docs.ovh.com/es/storage/s3/veeam/',
      IT: 'https://docs.ovh.com/it/storage/s3/veeam/',
      PT: 'https://docs.ovh.com/pt/storage/s3/veeam/',
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/4605427690131-How-to-Use-S3-Object-Storage-with-Veeam',
    },
    link: '',
  },
  {
    id: 's3-limitation',
    links: {
      DEFAULT: 'https://docs.ovh.com/gb/en/storage/s3/limitations/',
      FR: 'https://docs.ovh.com/fr/storage/s3/limitations/',
      DE: 'https://docs.ovh.com/de/storage/s3/limitations/',
      GB: 'https://docs.ovh.com/gb/en/storage/s3/limitations/',
      CA: 'https://docs.ovh.com/ca/en/storage/s3/limitations/',
      ES: 'https://docs.ovh.com/es/storage/s3/limitations/',
      IT: 'https://docs.ovh.com/it/storage/s3/limitations/',
      PT: 'https://docs.ovh.com/pt/storage/s3/limitations/',
      US:
        'https://support.us.ovhcloud.com/hc/en-us/articles/4605467875603-Object-Storage-Technical-Limitations',
    },
    link: '',
  },
];

export const NO_ENCRYPTION_VALUE = 'plaintext';

const encryptionAlgorithmSseS3 = 'AES256';
export const ENCRYPTION_ALGORITHMS_FALLBACK = [
  encryptionAlgorithmSseS3,
  NO_ENCRYPTION_VALUE,
];

const trackingStorageEncryption =
  'PublicCloud::storages::objects_storage_container::funnel::radio_button::add_objects_storage_container::step4::encrypt_data::';

export const TRACKING = {
  STORAGE_ENCRYPTION: {
    [NO_ENCRYPTION_VALUE]: `${trackingStorageEncryption}no_encrypt`,
    [encryptionAlgorithmSseS3]: `${trackingStorageEncryption}sse-s3`,
    [`TOOLTIP_FUNNEL_${encryptionAlgorithmSseS3}`]: `${trackingStorageEncryption}tooltip_sse-s3`,
    [`TOOLTIP_${encryptionAlgorithmSseS3}`]: 'PublicCloud::storages::objects_storage_container::page::tooltip_encrypted_omk_sse-s3',
  },
};

export default {
  STORAGES_CONTAINER_NAME_PATTERN,

  OBJECT_CONTAINER_OFFERS_TYPES,
  OBJECT_CONTAINER_OFFER_SWIFT,
  OBJECT_CONTAINER_OFFER_HIGH_PERFORMANCE,
  OBJECT_CONTAINER_OFFERS,
  OBJECT_CONTAINER_DEPLOIMENT_MODES_LABELS,
  OBJECT_CONTAINER_DEPLOIMENT_MODES,
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
  OBJECT_CONTAINER_MODE_MONO_ZONE,
  OBJECT_CONTAINER_TYPE_OFFERS,
  OBJECT_CONTAINER_STORAGE_CLASS,

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
  X_AMZ_STORAGE_CLASS,

  CONTAINER_GUIDES,
  NO_ENCRYPTION_VALUE,
  ENCRYPTION_ALGORITHMS_FALLBACK,
  TRACKING,
};
