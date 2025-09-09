export const TRACKING_PREFIX =
  'PublicCloud::pci::projects::project::storages::objects::';

export const MEGA_BYTES = 1024;

export enum ObjectContainerMode {
  MULTI_ZONES = 'region-3-az',
  MONO_ZONE = 'region',
  LOCAL_ZONE = 'localzone',
}

export const OBJECT_CONTAINER_S3_STATIC_URL_INFO = 'Virtual Hosted-Style :';

export const OFFSITE_REPLICATION_CODE = 'storage-standard-ia.consumption';

export const OBJECT_CONTAINER_DEPLOYMENT_MODES_LABELS = {
  [ObjectContainerMode.MULTI_ZONES]: {
    beta: false,
    new: false,
    isMultiZone: true,
    isMonoZone: false,
    isLocalZone: false,
    price: null,
  },
  [ObjectContainerMode.MONO_ZONE]: {
    beta: false,
    new: false,
    isMultiZone: false,
    isMonoZone: true,
    isLocalZone: false,
    price: null,
  },
  [ObjectContainerMode.LOCAL_ZONE]: {
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

export const STORAGE_ASYNC_REPLICATION_LINK = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062417',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062424',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062420',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062423',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062426',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062427',
  EU:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062415',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062418',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062422',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062415',
  IN:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062424',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062425',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062418',
  NL:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062417',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062421',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062414',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062413',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062416',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062418',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062418',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/34270032176019-Object-Storage-Master-asynchronous-replication-across-your-buckets',
  WE:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062417',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-storage-s3-asynchronous-replication-buckets?id=kb_article_view&sysparm_article=KB0062419',
};

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

export const STORAGE_CLASSES_LINK = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047293',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0034615',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047281',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB00472839',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047284',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047288',
  EU:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047293',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047302',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047294',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047293',
  IN:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0034615',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047303',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047302',
  NL:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047293',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047292',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047296',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047300',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047287',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047302',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047302',
  US:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047289',
  WE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047293',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-storage-s3-choosing-right-storage-class?id=kb_article_view&sysparm_article=KB0047290',
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

export const ENABLE_ENCRYPTION_LINK = {
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047314',
  ASIA:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0034643',
  AU:
    'https://help.ovhcloud.com/csm/en-au-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047311',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047310',
  DE:
    'https://help.ovhcloud.com/csm/de-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047307',
  ES:
    'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047312',
  EU:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047320',
  FR:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047318',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047322',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047320',
  IN:
    'https://help.ovhcloud.com/csm/asia-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0034643',
  IT:
    'https://help.ovhcloud.com/csm/it-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047319',
  MA:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047318',
  NL:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047320',
  PL:
    'https://help.ovhcloud.com/csm/pl-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047321',
  PT:
    'https://help.ovhcloud.com/csm/pt-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047329',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047326',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047324',
  SN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047318',
  TN:
    'https://help.ovhcloud.com/csm/fr-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047318',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/10694235769747-Object-Storage-Encrypt-Your-Server-Side-Objects-with-SSE-C-or-SSE-OMK',
  WE:
    'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047320',
  WS:
    'https://help.ovhcloud.com/csm/es-public-cloud-storage-s3-encrypt-objects-sse-c?id=kb_article_view&sysparm_article=KB0047325',
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

const trackingStorageEncryption =
  'PublicCloud::storages::objects_storage_container::funnel::radio_button::add_objects_storage_container::step4::encrypt_data::';

const encryptionAlgorithmSseS3 = 'AES256';

export const TRACKING = {
  STORAGE_ENCRYPTION: {
    [NO_ENCRYPTION_VALUE]: `${trackingStorageEncryption}no_encrypt`,
    [encryptionAlgorithmSseS3]: `${trackingStorageEncryption}sse-s3`,
    [`TOOLTIP_FUNNEL_${encryptionAlgorithmSseS3}`]: `${trackingStorageEncryption}tooltip_sse-s3`,
    [`TOOLTIP_${encryptionAlgorithmSseS3}`]: 'PublicCloud::storages::objects_storage_container::page::tooltip_encrypted_omk_sse-s3',
  },
};

export const OPENIO_PRESIGN_EXPIRE = 3600;

export const OBJECT_CONTAINER_OFFER_STORAGE_STANDARD = 'storage-s3-standard';
export const OBJECT_CONTAINER_OFFER_SWIFT = 'storage';

export const PLAN_CODES = {
  [OBJECT_CONTAINER_OFFER_STORAGE_STANDARD]: 'storage-standard.consumption',
  [OBJECT_CONTAINER_OFFER_SWIFT]: 'storage.consumption',
};

export const STORAGE_STANDARD_PLANCODE = 'storage-standard.consumption';
export const STORAGE_STANDARD_REGION_PLANCODE = 'storage-standard';

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

export const OBJECT_CONTAINER_TYPE_STATIC = 'static';
export const OBJECT_CONTAINER_TYPE_PRIVATE = 'private';
export const OBJECT_CONTAINER_TYPE_PUBLIC = 'public';
export const OBJECT_CONTAINER_TYPES = [
  OBJECT_CONTAINER_TYPE_STATIC,
  OBJECT_CONTAINER_TYPE_PRIVATE,
  OBJECT_CONTAINER_TYPE_PUBLIC,
];

export const CONTAINER_COMMERCIAL_NAME = 'storage-replicated';
export const ENCRYPTION_ALGORITHM_SSE_S3 = 'AES256';

export const CONTAINER_USER_ASSOCIATION_MODES = {
  LINKED: 'LINKED',
  CREATE: 'CREATE',
};

export const X_CONTAINER_HEADERS_REGEX = /^(X-Container|X-Storage)/i;

export const X_AUTH_TOKEN = 'X-Auth-Token';
export const X_STORAGE_POLICY = 'x-storage-policy';
export const X_AMZ_STORAGE_CLASS = 'X-Amz-Storage-Class';
export const X_CONTAINER_READ = 'x-container-read';
export const X_CONTAINER_META_WEB_LISTINGS = 'x-container-meta-web-listings';
export const X_CONTAINER_READ_PUBLIC_VALUE = '.r:*,.rlistings';

export const BACKUP_KEY = 'ovh:backup';

export const MUMBAI_REGION_NAME = 'AP-SOUTH-MUM';

export const STATUS_DISABLED = 'disabled';
export const STATUS_ENABLED = 'enabled';
export const STATUS_SUSPENDED = 'suspended';

export const PERMANENTLY_DELETE_MSG = 'PERMANENTLY DELETE';
export const CHANGELOG_LINKS = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Public+Cloud+Storage',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Public+Cloud+Storage',
  'feature-request':
    'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};
export const ITEMS_PER_PAGE = 999;

export const UNIVERSE = 'PublicCloud';
export const SUB_UNIVERSE = 'storages';
export const APP_NAME = 'objects_storage_container';

export enum ReplicationStorageClass {
  STANDARD = 'STANDARD',
  STANDARD_IA = 'STANDARD_IA',
  HIGH_PERF = 'HIGH_PERF',
}
