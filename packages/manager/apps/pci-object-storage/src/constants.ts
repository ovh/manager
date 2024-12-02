export const TRACKING_PREFIX =
  'PublicCloud::pci::projects::project::storages::objects::';

export const OBJECT_CONTAINER_MODE_MULTI_ZONES = 'region-3-az';
export const OBJECT_CONTAINER_MODE_MONO_ZONE = 'region';
export const OBJECT_CONTAINER_MODE_LOCAL_ZONE = 'localzone';

export const AVAILABILITY = {
  LOCALZONE: 'public-cloud:object-storage:localzone',
  '3AZ': 'public-cloud:object-storage:3az',
  STANDARD_S3: 'object-storage:standard-s3',
};

export const GUIDES = [
  {
    id: 'object-storage-domain',
    link: {
      DEFAULT:
        'https://docs.ovh.com/gb/en/public-cloud/place-an-object-storage-container-behind-domain-name/',
    },
  },
  {
    id: 'auto-delete-object',
    link: {
      DEFAULT:
        'https://docs.ovh.com/gb/en/public-cloud/configure-auto-delete-objects/',
    },
  },
  {
    id: 'share-object-temporary-url',
    link: {
      DEFAULT:
        'https://docs.ovh.com/gb/en/public-cloud/share_an_object_via_a_temporary_url/',
    },
  },
  {
    id: 'sync-object-containers',
    link: {
      DEFAULT:
        'https://docs.ovh.com/gb/en/public-cloud/sync-object-containers/',
    },
  },
];

export const STANDARD_S3 = [
  {
    id: 'getting-started-with-s3',
    link: {
      DEFAULT: 'https://docs.ovh.com/gb/en/storage/s3/getting-started-with-s3/',
      DE: 'https://docs.ovh.com/de/storage/s3/getting-started-with-s3/',
      ES: 'https://docs.ovh.com/es/storage/s3/getting-started-with-s3/',
      FR: 'https://docs.ovh.com/fr/storage/s3/debuter-avec-s3/',
      GB: 'https://docs.ovh.com/gb/en/storage/s3/getting-started-with-s3/',
      IE: 'https://docs.ovh.com/ie/en/storage/s3/getting-started-with-s3/',
      IT: 'https://docs.ovh.com/it/storage/s3/getting-started-with-s3/',
      PL: 'https://docs.ovh.com/pl/storage/s3/getting-started-with-s3/',
      PT: 'https://docs.ovh.com/pt/storage/s3/getting-started-with-s3/',
    },
  },
  {
    id: 'storage',
    link: {
      DEFAULT: 'https://docs.ovh.com/gb/en/storage/',
      DE: 'https://docs.ovh.com/de/storage/',
      ES: 'https://docs.ovh.com/es/storage/',
      FR: 'https://docs.ovh.com/fr/storage/',
      GB: 'https://docs.ovh.com/gb/en/storage/',
      IE: 'https://docs.ovh.com/ie/en/storage/',
      IT: 'https://docs.ovh.com/it/storage/',
      PL: 'https://docs.ovh.com/pl/storage/',
      PT: 'https://docs.ovh.com/pt/storage/',
    },
  },
];
export const DOWNLOAD_FILENAME = 'import.json';
export const DOWNLOAD_TYPE = 'application/json"';

export const OBJECT_STORAGE_USER_ROLE = 'objectstore_operator';

export const TRACKING_S3_POLICY_ADD = 's3-policies-users::add';
export const OPENIO_DEFAULT_REGION = 'SBG';

export const OBJECT_CONTAINER_OFFER_STORAGE_STANDARD = 'storage-s3-standard';
