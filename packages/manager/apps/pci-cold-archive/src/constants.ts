export const DOWNLOAD_FILENAME = 'import.json';
export const DOWNLOAD_TYPE = 'application/json';

export const OBJECT_STORAGE_USER_ROLE = 'objectstore_operator';
export const TRACKING_S3_POLICY_ADD = 's3-policies-users::add';
export const OPENIO_DEFAULT_REGION = 'SBG';

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
