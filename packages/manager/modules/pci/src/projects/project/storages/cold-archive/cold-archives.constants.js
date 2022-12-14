export const COLD_ARCHIVE_TRACKING_PREFIX =
  'PublicCloud::pci::projects::project::storages::cold_archive';

export const REGION = 'RBX-ARCHIVE';

export const DATE_FORMAT = 'DD/MM/YYYY HH:mm';

export const CHECK_PRICES_DOC_LINK = {
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/prices/#',
  DE: 'https://www.ovhcloud.com/de/public-cloud/prices/#',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/prices/#',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/prices/#',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/prices/#',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/prices/#',
  SG: 'https://www.ovhcloud.com/en-sq/public-cloud/prices/#',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/prices/#',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/prices/#',
  FR: 'https://www.ovhcloud.com/fr/public-cloud/prices/#',
  MA: 'https://www.ovhcloud.com/fr-ma/public-cloud/prices/#',
  SN: 'https://www.ovhcloud.com/fr-sn/public-cloud/prices/#',
  TN: 'https://www.ovhcloud.com/fr-tn/public-cloud/prices/#',
  IT: 'https://www.ovhcloud.com/it/public-cloud/prices/#',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/prices/#',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/prices/#',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/prices/#',
  WS: 'https://www.ovhcloud.com/es/public-cloud/prices/#',
  WE: 'https://www.ovhcloud.com/en/public-cloud/prices/#',
};

export const MANAGE_ARCHIVE_DOC_LINK = {
  DEFAULT:
    'https://docs.ovh.com/en/storage/object-storage/s3/getting-started-with-object-storage/',
  DE:
    'https://docs.ovh.com/de/storage/object-storage/s3/getting-started-with-object-storage/',
  ES:
    'https://docs.ovh.com/es/storage/object-storage/s3/getting-started-with-object-storage/',
  FR:
    'https://docs.ovh.com/fr/storage/object-storage/s3/getting-started-with-object-storage/',
  CA:
    'https://docs.ovh.com/ca/storage/object-storage/s3/getting-started-with-object-storage/',
  EN:
    'https://docs.ovh.com/en/storage/object-storage/s3/getting-started-with-object-storage/',
  IT:
    'https://docs.ovh.com/it/storage/object-storage/s3/getting-started-with-object-storage/',
  PL:
    'https://docs.ovh.com/pl/storage/object-storage/s3/getting-started-with-object-storage/',
  PT:
    'https://docs.ovh.com/pt/storage/object-storage/s3/getting-started-with-object-storage/',
};

export const GUIDES = [
  {
    id: 'overview',
    links: {
      DEFAULT:
        'https://docs.ovh.com/en/storage/object-storage/cold-archive/overview/',
      DE:
        'https://docs.ovh.com/de/storage/object-storage/cold-archive/overview/',
      ES:
        'https://docs.ovh.com/es/storage/object-storage/cold-archive/overview/',
      FR:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/overview/',
      CA:
        'https://docs.ovh.com/ca/storage/object-storage/cold-archive/overview/',
      EN:
        'https://docs.ovh.com/en/storage/object-storage/cold-archive/overview/',
      IT:
        'https://docs.ovh.com/it/storage/object-storage/cold-archive/overview/',
      PL:
        'https://docs.ovh.com/pl/storage/object-storage/cold-archive/overview/',
      PT:
        'https://docs.ovh.com/pt/storage/object-storage/cold-archive/overview/',
    },
  },
  {
    id: 'first-step',
    links: {
      DEFAULT:
        'https://docs.ovh.com/en/storage/object-storage/cold-archive/getting-started',
      DE:
        'https://docs.ovh.com/de/storage/object-storage/cold-archive/getting-started',
      ES:
        'https://docs.ovh.com/es/storage/object-storage/cold-archive/getting-started',
      FR:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/getting-started',
      CA:
        'https://docs.ovh.com/ca/storage/object-storage/cold-archive/getting-started',
      EN:
        'https://docs.ovh.com/en/storage/object-storage/cold-archive/getting-started',
      IT:
        'https://docs.ovh.com/it/storage/object-storage/cold-archive/getting-started',
      PL:
        'https://docs.ovh.com/pl/storage/object-storage/cold-archive/getting-started',
      PT:
        'https://docs.ovh.com/pt/storage/object-storage/cold-archive/getting-started',
    },
  },
  {
    id: 'manage-your-data',
    links: {
      DEFAULT:
        'https://docs.ovh.com/en/storage/object-storage/cold-archive/manage-your-data',
      DE:
        'https://docs.ovh.com/de/storage/object-storage/cold-archive/manage-your-data',
      ES:
        'https://docs.ovh.com/es/storage/object-storage/cold-archive/manage-your-data',
      FR:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/manage-your-data',
      CA:
        'https://docs.ovh.com/ca/storage/object-storage/cold-archive/manage-your-data',
      EN:
        'https://docs.ovh.com/en/storage/object-storage/cold-archive/manage-your-data',
      IT:
        'https://docs.ovh.com/it/storage/object-storage/cold-archive/manage-your-data',
      PL:
        'https://docs.ovh.com/pl/storage/object-storage/cold-archive/manage-your-data',
      PT:
        'https://docs.ovh.com/pt/storage/object-storage/cold-archive/manage-your-data',
    },
  },
];
const COLD_ARCHIVE_ROOT_STATE = 'pci.projects.project.storages.cold-archive';
export const COLD_ARCHIVE_STATES = {
  ROOT: COLD_ARCHIVE_ROOT_STATE,
  ONBOARDING: `${COLD_ARCHIVE_ROOT_STATE}.onboarding`,
  CONTAINERS: `${COLD_ARCHIVE_ROOT_STATE}.containers`,
  CONTAINERS_CONTAINER: `${COLD_ARCHIVE_ROOT_STATE}.containers.container`,
  CONTAINERS_CONTAINER_ADD: `${COLD_ARCHIVE_ROOT_STATE}.containers.add`,
  CONTAINERS_CONTAINER_MANAGE: `${COLD_ARCHIVE_ROOT_STATE}.containers.manage`,
  CONTAINERS_CONTAINER_ARCHIVE: `${COLD_ARCHIVE_ROOT_STATE}.containers.archive`,
  CONTAINERS_CONTAINER_RESTORE: `${COLD_ARCHIVE_ROOT_STATE}.containers.restore`,
  CONTAINERS_CONTAINER_ADD_USER: `${COLD_ARCHIVE_ROOT_STATE}.containers.add-user`,
  CONTAINERS_CONTAINER_DELETE: `${COLD_ARCHIVE_ROOT_STATE}.containers.delete-container`,
  CONTAINERS_CONTAINER_OBJECTS_DELETE: `${COLD_ARCHIVE_ROOT_STATE}.containers.delete-objects`,
  CONTAINERS_CONTAINER_ARCHIVE_DELETE: `${COLD_ARCHIVE_ROOT_STATE}.containers.delete-archive`,
  S3_USERS: `${COLD_ARCHIVE_ROOT_STATE}.users`,
  S3_USERS_ADD: `${COLD_ARCHIVE_ROOT_STATE}.users.add`,
  S3_USERS_IMPORT_POLICY: `${COLD_ARCHIVE_ROOT_STATE}.users.import-policy`,
  S3_USERS_DOWNLOAD_RCLONE: `${COLD_ARCHIVE_ROOT_STATE}.users.download-rclone`,
  S3_USERS_DELETE: `${COLD_ARCHIVE_ROOT_STATE}.users.delete`,
};

export default {
  COLD_ARCHIVE_STATES,
  COLD_ARCHIVE_TRACKING_PREFIX,
  CHECK_PRICES_DOC_LINK,
  MANAGE_ARCHIVE_DOC_LINK,
  REGION,
  GUIDES,
  DATE_FORMAT,
};
