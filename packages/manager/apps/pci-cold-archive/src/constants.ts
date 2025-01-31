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
