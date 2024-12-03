export const TRACKING_PREFIX =
  'PublicCloud::pci::projects::project::storages::objects::';

export const MEGA_BYTES = 1024;

export const OBJECT_CONTAINER_MODE_MULTI_ZONES = 'region-3-az';
export const OBJECT_CONTAINER_MODE_MONO_ZONE = 'region';
export const OBJECT_CONTAINER_MODE_LOCAL_ZONE = 'localzone';

export const OBJECT_CONTAINER_DEPLOYMENT_MODES = [
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
  OBJECT_CONTAINER_MODE_MONO_ZONE,
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
];

export const OBJECT_CONTAINER_DEPLOYMENT_MODES_LABELS = {
  [OBJECT_CONTAINER_MODE_MULTI_ZONES]: {
    beta: false,
    new: false,
    isMultiZone: true,
    isMonoZone: false,
    isLocalZone: false,
    price: null,
  },
  [OBJECT_CONTAINER_MODE_MONO_ZONE]: {
    beta: false,
    new: false,
    isMultiZone: false,
    isMonoZone: true,
    isLocalZone: false,
    price: null,
  },
  [OBJECT_CONTAINER_MODE_LOCAL_ZONE]: {
    beta: false,
    new: false,
    isMultiZone: false,
    isMonoZone: false,
    isLocalZone: true,
    price: null,
  },
};

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

export const DEPLOYMENT_MODE_LINK = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065336',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065346',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065339',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065340',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065337',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065348',
  EU:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065349',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065345',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065338',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065349',
  IN:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065346',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065347',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065345',
  NL:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065336',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065335',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065342',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065344',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065343',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065345',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065345',
  US:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065336',
  WE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065349',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-storage-s3-deployments-modes?id=kb_article_view&sysparm_article=KB0065341',
};

export const OBJECT_CONTAINER_USER_ROLE_ADMIN = 'admin';
export const OBJECT_CONTAINER_USER_ROLE_DENY = 'deny';
export const OBJECT_CONTAINER_USER_ROLE_READ_ONLY = 'readOnly';
export const OBJECT_CONTAINER_USER_ROLE_READ_WRITE = 'readWrite';
export const OBJECT_CONTAINER_USER_ROLES = [
  OBJECT_CONTAINER_USER_ROLE_ADMIN,
  OBJECT_CONTAINER_USER_ROLE_READ_WRITE,
  OBJECT_CONTAINER_USER_ROLE_READ_ONLY,
  OBJECT_CONTAINER_USER_ROLE_DENY,
];

export const OBJECT_CONTAINER_OFFER_STORAGE_STANDARD = 'storage-s3-standard';
export const OBJECT_CONTAINER_OFFER_SWIFT = 'storage';

export const PLAN_CODES = {
  [OBJECT_CONTAINER_OFFER_STORAGE_STANDARD]: 'storage-standard.consumption',
  [OBJECT_CONTAINER_OFFER_SWIFT]: 'storage.consumption',
};

export const STORAGE_STANDARD_PLANCODE = 'storage-standard.consumption';

export const OBJECT_CONTAINER_OFFERS = [
  OBJECT_CONTAINER_OFFER_STORAGE_STANDARD,
  OBJECT_CONTAINER_OFFER_SWIFT,
];

export const OBJECT_CONTAINER_OFFERS_LABELS = {
  [OBJECT_CONTAINER_OFFER_SWIFT]: {
    beta: false,
    new: false,
    recommanded: false,
    price: null,
  },
  [OBJECT_CONTAINER_OFFER_STORAGE_STANDARD]: {
    beta: false,
    new: false,
    recommanded: true,
    price: null,
  },
};
