export const COLD_ARCHIVE_TRACKING = {
  CLICK_PREFIX: 'PublicCloud::pci::projects::project::storages::cold_archive',
  PAGE_PREFIX: 'pci::projects::project::storages::cold_archive',
  SEE_PRICE: 'dashboard::see-prices',
  GUIDE: 'public-cloud_cold_archive::guides::go_to',
  ONBOARDING: {
    MAIN: 'onboarding',
    ADD_CONTAINER: 'add',
    DOCUMENTATION_LINK: 'docs',
  },
  ADD_USER: {
    MAIN: 'add-user',
    ASSOCIATE: {
      NEW_USER: 'add_new_user',
      EXISTING_USER: 'add_existing_user',
      ASSOCIATE_USER: 'associate_user',
      SEE_CREDENTIALS: 'see_credentials',
    },
    CREATE: 'create_container',
    USER_SUCCESS_BANNER: {
      USERNAME: {
        id: 'username',
        tracking: 'add-user::add_success_copy-s3-name',
      },
      DESCRIPTION: {
        id: 'description',
        tracking: 'add-user::add_success_copy-description',
      },
      ACCESS_KEY: {
        id: 's3AccessKey',
        tracking: 'add-user::add_success_copy-s3-access-key',
      },
      SECRET_KEY: {
        id: 'secretKey',
        tracking: 'add-user::add_success_copy-s3-secret-key',
      },
    },
  },
  CONTAINERS: {
    MAIN: 'dashboard::containers',
    RESTORE: 'restore',
    ADD_CONTAINER: 'add',
    ARCHIVE: 'archive',
    EDIT_RETENTION: 'edit-retention',
    DELETE: 'delete',
    MANAGE_CONTAINER: 'manage-container',
    DELETE_CONTAINER: 'delete-container',
    FLUSH_CONTAINER: 'flush-container',
    ADD_USER: 'add-user',
    USER_SUCCESS_BANNER: {
      USERNAME: {
        id: 'username',
        tracking: 'add_success_copy-s3-name',
      },
      DESCRIPTION: {
        id: 'description',
        tracking: 'add_success_copy-description',
      },
      ACCESS_KEY: {
        id: 's3AccessKey',
        tracking: 'add_success_copy-s3-access-key',
      },
      SECRET_KEY: {
        id: 'secretKey',
        tracking: 'add_success_copy-s3-secret-key',
      },
    },
  },
  USER: {
    MAIN: 'dashboard::s3_users',
    ADD_USER: 'add_user',
    CREATE_USER_MODES: {
      NEW_USER: 'confirm_new',
      EXISTING_USER: 'confirm_existing',
    },
    ACTIONS: {
      MENU: 'action_menu',
      DELETE_USER: 'delete_user_credentials',
      ADD_POLICY: 'add_s3_policy',
      DELETE_POLICY: 'delete_s3_policy',
      IMPORT_POLICY: 'import_s3_policy',
      DOWNLOAD_POLICY: 'download_s3_policy',
      DOWNLOAD_RCLONE: 'download_rClone_file',
      DISPLAY_SECRET: 'display_secret_key',
      GENERATE_CREDENTIAL: 'generate_user_credentials',
      DELETE_CREDENTIALS: 'delete_user_credentials',
    },
  },
  ACTIONS: {
    CONFIRM: 'confirm',
    CANCEL: 'cancel',
  },
  STATUS: {
    SUCCESS: 'success',
    ERROR: 'error',
  },
};

export const DATE_FORMAT = 'DD/MM/YYYY HH:mm';

export const CHECK_PRICES_DOC_LINK = {
  DEFAULT: 'https://www.ovhcloud.com/en/public-cloud/prices/#11500',
  FR: 'https://www.ovhcloud.com/fr/public-cloud/prices/#11500',
  MA: 'https://www.ovhcloud.com/fr-ma/public-cloud/prices/#11500',
  TN: 'https://www.ovhcloud.com/fr-tn/public-cloud/prices/#11500',
  SN: 'https://www.ovhcloud.com/fr-sn/public-cloud/prices/#11500',
  QC: 'https://www.ovhcloud.com/fr-ca/public-cloud/prices/#11500',
  GB: 'https://www.ovhcloud.com/en-gb/public-cloud/prices/#11500',
  IE: 'https://www.ovhcloud.com/en-ie/public-cloud/prices/#11500',
  WE: 'https://www.ovhcloud.com/en/public-cloud/prices/#11500',
  CA: 'https://www.ovhcloud.com/en-ca/public-cloud/prices/#11500',
  AU: 'https://www.ovhcloud.com/en-au/public-cloud/prices/#11500',
  SG: 'https://www.ovhcloud.com/en-sg/public-cloud/prices/#11500',
  ASIA: 'https://www.ovhcloud.com/asia/public-cloud/prices/#11500',
  IN: 'https://www.ovhcloud.com/en-in/public-cloud/prices/#11500',
  ES: 'https://www.ovhcloud.com/es-es/public-cloud/prices/#11500',
  WS: 'https://www.ovhcloud.com/es/public-cloud/prices/#11500',
  PT: 'https://www.ovhcloud.com/pt/public-cloud/prices/#11500',
  IT: 'https://www.ovhcloud.com/it/public-cloud/prices/#11500',
  PL: 'https://www.ovhcloud.com/pl/public-cloud/prices/#11500',
  DE: 'https://www.ovhcloud.com/de/public-cloud/prices/#11500',
  NL: 'https://www.ovhcloud.com/nl/public-cloud/prices/#11500',
};

export const MANAGE_ARCHIVE_DOC_LINK = {
  DEFAULT:
    'https://docs.ovh.com/us/en/storage/object-storage/s3/getting-started-with-object-storage/',
  FR:
    'https://docs.ovh.com/fr/storage/object-storage/s3/getting-started-with-object-storage/',
  MA:
    'https://docs.ovh.com/fr/storage/object-storage/s3/getting-started-with-object-storage/',
  TN:
    'https://docs.ovh.com/fr/storage/object-storage/s3/getting-started-with-object-storage/',
  SN:
    'https://docs.ovh.com/fr/storage/object-storage/s3/getting-started-with-object-storage/',
  QC:
    'https://docs.ovh.com/ca/fr/storage/object-storage/s3/getting-started-with-object-storage/',
  GB:
    'https://docs.ovh.com/gb/en/storage/object-storage/s3/getting-started-with-object-storage/',
  IE:
    'https://docs.ovh.com/ie/en/storage/object-storage/s3/getting-started-with-object-storage/',
  WE:
    'https://docs.ovh.com/us/en/storage/object-storage/s3/getting-started-with-object-storage/',
  CA:
    'https://docs.ovh.com/ca/en/storage/object-storage/s3/getting-started-with-object-storage/',
  AU:
    'https://docs.ovh.com/au/en/storage/object-storage/s3/getting-started-with-object-storage/',
  SG:
    'https://docs.ovh.com/sg/en/storage/object-storage/s3/getting-started-with-object-storage/',
  ASIA:
    'https://docs.ovh.com/asia/en/storage/object-storage/s3/getting-started-with-object-storage/',
  ES:
    'https://docs.ovh.com/es/storage/object-storage/s3/getting-started-with-object-storage/',
  WS:
    'https://docs.ovh.com/us/es/storage/object-storage/s3/getting-started-with-object-storage/',
  PT:
    'https://docs.ovh.com/pt/storage/object-storage/s3/getting-started-with-object-storage/',
  IT:
    'https://docs.ovh.com/it/storage/object-storage/s3/getting-started-with-object-storage/',
  PL:
    'https://docs.ovh.com/pl/storage/object-storage/s3/getting-started-with-object-storage/',
  DE:
    'https://docs.ovh.com/de/storage/object-storage/s3/getting-started-with-object-storage/',
  NL:
    'https://docs.ovh.com/gb/en/storage/object-storage/s3/getting-started-with-object-storage/',
};

export const GUIDE_MENU_ITEMS = [
  {
    id: 'storage-backup',
    links: {
      DEFAULT: 'https://docs.ovh.com/us/en/storage/',
      FR: 'https://docs.ovh.com/fr/storage/',
      MA: 'https://docs.ovh.com/fr/storage/',
      TN: 'https://docs.ovh.com/fr/storage/',
      SN: 'https://docs.ovh.com/fr/storage/',
      QC: 'https://docs.ovh.com/ca/fr/storage/',
      GB: 'https://docs.ovh.com/gb/en/storage/',
      IE: 'https://docs.ovh.com/ie/en/storage/',
      WE: 'https://docs.ovh.com/us/en/storage/',
      CA: 'https://docs.ovh.com/ca/en/storage/',
      AU: 'https://docs.ovh.com/au/en/storage/',
      SG: 'https://docs.ovh.com/sg/en/storage/',
      ASIA: 'https://docs.ovh.com/asia/en/storage/',
      ES: 'https://docs.ovh.com/es/storage/',
      WS: 'https://docs.ovh.com/us/es/storage/',
      PT: 'https://docs.ovh.com/pt/storage/',
      IT: 'https://docs.ovh.com/it/storage/',
      PL: 'https://docs.ovh.com/pl/storage/',
      DE: 'https://docs.ovh.com/de/storage/',
      NL: 'https://docs.ovh.com/gb/en/storage/',
    },
  },
  {
    id: 'overview',
    links: {
      DEFAULT:
        'https://docs.ovh.com/us/en/storage/object-storage/cold-archive/overview/',
      FR:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/overview/',
      MA:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/overview/',
      TN:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/overview/',
      SN:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/overview/',
      QC:
        'https://docs.ovh.com/ca/fr/storage/object-storage/cold-archive/overview/',
      GB:
        'https://docs.ovh.com/gb/en/storage/object-storage/cold-archive/overview/',
      IE:
        'https://docs.ovh.com/ie/en/storage/object-storage/cold-archive/overview/',
      WE:
        'https://docs.ovh.com/us/en/storage/object-storage/cold-archive/overview/',
      CA:
        'https://docs.ovh.com/ca/en/storage/object-storage/cold-archive/overview/',
      AU:
        'https://docs.ovh.com/au/en/storage/object-storage/cold-archive/overview/',
      SG:
        'https://docs.ovh.com/sg/en/storage/object-storage/cold-archive/overview/',
      ASIA:
        'https://docs.ovh.com/asia/en/storage/object-storage/cold-archive/overview/',
      ES:
        'https://docs.ovh.com/es/storage/object-storage/cold-archive/overview/',
      WS:
        'https://docs.ovh.com/us/es/storage/object-storage/cold-archive/overview/',
      PT:
        'https://docs.ovh.com/pt/storage/object-storage/cold-archive/overview/',
      IT:
        'https://docs.ovh.com/it/storage/object-storage/cold-archive/overview/',
      PL:
        'https://docs.ovh.com/pl/storage/object-storage/cold-archive/overview/',
      DE:
        'https://docs.ovh.com/de/storage/object-storage/cold-archive/overview/',
      NL:
        'https://docs.ovh.com/gb/en/storage/object-storage/cold-archive/overview/',
    },
  },
  {
    id: 'getting-started-with-cold-archive',
    links: {
      DEFAULT:
        'https://docs.ovh.com/us/en/storage/object-storage/cold-archive/getting-started/',
      FR:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/getting-started/',
      MA:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/getting-started/',
      TN:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/getting-started/',
      SN:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/getting-started/',
      QC:
        'https://docs.ovh.com/ca/fr/storage/object-storage/cold-archive/getting-started/',
      GB:
        'https://docs.ovh.com/gb/en/storage/object-storage/cold-archive/getting-started/',
      IE:
        'https://docs.ovh.com/ie/en/storage/object-storage/cold-archive/getting-started/',
      WE:
        'https://docs.ovh.com/us/en/storage/object-storage/cold-archive/getting-started/',
      CA:
        'https://docs.ovh.com/ca/en/storage/object-storage/cold-archive/getting-started/',
      AU:
        'https://docs.ovh.com/au/en/storage/object-storage/cold-archive/getting-started/',
      SG:
        'https://docs.ovh.com/sg/en/storage/object-storage/cold-archive/getting-started/',
      ASIA:
        'https://docs.ovh.com/asia/en/storage/object-storage/cold-archive/getting-started/',
      ES:
        'https://docs.ovh.com/es/storage/object-storage/cold-archive/getting-started/',
      WS:
        'https://docs.ovh.com/us/es/storage/object-storage/cold-archive/getting-started/',
      PT:
        'https://docs.ovh.com/pt/storage/object-storage/cold-archive/getting-started/',
      IT:
        'https://docs.ovh.com/it/storage/object-storage/cold-archive/getting-started/',
      PL:
        'https://docs.ovh.com/pl/storage/object-storage/cold-archive/getting-started/',
      DE:
        'https://docs.ovh.com/de/storage/object-storage/cold-archive/getting-started/',
      NL:
        'https://docs.ovh.com/gb/en/storage/object-storage/cold-archive/getting-started/',
    },
  },
  {
    id: 'manage-your-data',
    links: MANAGE_ARCHIVE_DOC_LINK,
  },
];

export const ONBOARDING_DOC_LINKS = [
  {
    id: 'overview',
    links: {
      DEFAULT:
        'https://docs.ovh.com/us/en/storage/object-storage/cold-archive/overview/',
      FR:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/overview/',
      MA:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/overview/',
      TN:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/overview/',
      SN:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/overview/',
      QC:
        'https://docs.ovh.com/ca/fr/storage/object-storage/cold-archive/overview/',
      GB:
        'https://docs.ovh.com/gb/en/storage/object-storage/cold-archive/overview/',
      IE:
        'https://docs.ovh.com/ie/en/storage/object-storage/cold-archive/overview/',
      WE:
        'https://docs.ovh.com/us/en/storage/object-storage/cold-archive/overview/',
      CA:
        'https://docs.ovh.com/ca/en/storage/object-storage/cold-archive/overview/',
      AU:
        'https://docs.ovh.com/au/en/storage/object-storage/cold-archive/overview/',
      SG:
        'https://docs.ovh.com/sg/en/storage/object-storage/cold-archive/overview/',
      ASIA:
        'https://docs.ovh.com/asia/en/storage/object-storage/cold-archive/overview/',
      ES:
        'https://docs.ovh.com/es/storage/object-storage/cold-archive/overview/',
      WS:
        'https://docs.ovh.com/us/es/storage/object-storage/cold-archive/overview/',
      PT:
        'https://docs.ovh.com/pt/storage/object-storage/cold-archive/overview/',
      IT:
        'https://docs.ovh.com/it/storage/object-storage/cold-archive/overview/',
      PL:
        'https://docs.ovh.com/pl/storage/object-storage/cold-archive/overview/',
      DE:
        'https://docs.ovh.com/de/storage/object-storage/cold-archive/overview/',
      NL:
        'https://docs.ovh.com/gb/en/storage/object-storage/cold-archive/overview/',
    },
  },
  {
    id: 'getting-started-with-cold-archive',
    links: {
      DEFAULT:
        'https://docs.ovh.com/us/en/storage/object-storage/cold-archive/getting-started/',
      FR:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/getting-started/',
      MA:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/getting-started/',
      TN:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/getting-started/',
      SN:
        'https://docs.ovh.com/fr/storage/object-storage/cold-archive/getting-started/',
      QC:
        'https://docs.ovh.com/ca/fr/storage/object-storage/cold-archive/getting-started/',
      GB:
        'https://docs.ovh.com/gb/en/storage/object-storage/cold-archive/getting-started/',
      IE:
        'https://docs.ovh.com/ie/en/storage/object-storage/cold-archive/getting-started/',
      WE:
        'https://docs.ovh.com/us/en/storage/object-storage/cold-archive/getting-started/',
      CA:
        'https://docs.ovh.com/ca/en/storage/object-storage/cold-archive/getting-started/',
      AU:
        'https://docs.ovh.com/au/en/storage/object-storage/cold-archive/getting-started/',
      SG:
        'https://docs.ovh.com/sg/en/storage/object-storage/cold-archive/getting-started/',
      ASIA:
        'https://docs.ovh.com/asia/en/storage/object-storage/cold-archive/getting-started/',
      ES:
        'https://docs.ovh.com/es/storage/object-storage/cold-archive/getting-started/',
      WS:
        'https://docs.ovh.com/us/es/storage/object-storage/cold-archive/getting-started/',
      PT:
        'https://docs.ovh.com/pt/storage/object-storage/cold-archive/getting-started/',
      IT:
        'https://docs.ovh.com/it/storage/object-storage/cold-archive/getting-started/',
      PL:
        'https://docs.ovh.com/pl/storage/object-storage/cold-archive/getting-started/',
      DE:
        'https://docs.ovh.com/de/storage/object-storage/cold-archive/getting-started/',
      NL:
        'https://docs.ovh.com/gb/en/storage/object-storage/cold-archive/getting-started/',
    },
  },
  {
    id: 'manage-your-data',
    links: MANAGE_ARCHIVE_DOC_LINK,
  },
];
const COLD_ARCHIVE_ROOT_STATE = 'pci.projects.project.storages.cold-archive';
export const COLD_ARCHIVE_STATES = {
  ROOT: COLD_ARCHIVE_ROOT_STATE,
  ONBOARDING: `${COLD_ARCHIVE_ROOT_STATE}.onboarding`,
  CONTAINER_ADD: `${COLD_ARCHIVE_ROOT_STATE}.add`,
  CONTAINERS: `${COLD_ARCHIVE_ROOT_STATE}.containers`,
  CONTAINERS_CONTAINER: `${COLD_ARCHIVE_ROOT_STATE}.containers.container`,
  CONTAINERS_CONTAINER_MANAGE: `${COLD_ARCHIVE_ROOT_STATE}.containers.manage`,
  CONTAINERS_CONTAINER_ARCHIVE: `${COLD_ARCHIVE_ROOT_STATE}.containers.archive`,
  CONTAINERS_CONTAINER_EDIT_RETENTION: `${COLD_ARCHIVE_ROOT_STATE}.containers.edit-retention`,
  CONTAINERS_CONTAINER_RESTORE: `${COLD_ARCHIVE_ROOT_STATE}.containers.restore`,
  CONTAINERS_CONTAINER_ADD_USER: `${COLD_ARCHIVE_ROOT_STATE}.containers.add-user`,
  CONTAINERS_ARCHIVE_FLUSH: `${COLD_ARCHIVE_ROOT_STATE}.containers.flush-archive`,
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
  CHECK_PRICES_DOC_LINK,
  MANAGE_ARCHIVE_DOC_LINK,
  ONBOARDING_DOC_LINKS,
  GUIDE_MENU_ITEMS,
  DATE_FORMAT,
};
