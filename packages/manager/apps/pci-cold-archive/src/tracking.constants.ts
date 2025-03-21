export const COLD_ARCHIVE_TRACKING = {
  PAGE_PREFIX: 'PublicCloud::pci::projects::project::storages::cold_archive',
  PCI_LEVEL2: '86',
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
    CLIPBOARD_PREFIX: 'add',
    ARCHIVE: 'archive',
    EDIT_RETENTION: 'edit-retention',
    DELETE: 'delete',
    MANAGE_CONTAINER: 'manage-container',
    DELETE_CONTAINER: 'delete-container',
    FLUSH_CONTAINER: 'flush-container',
    ADD_USER: 'add-user',
    USER: {
      CLIPBOARD_PREFIX: 'add::add-user::add',
    },
    STEPPER: {
      STEP_1: 'cold_archive_link_user_archive',
      STEP_2: 'cold_archive_name_archive',
    },
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
    CLIPBOARD_PREFIX: 's3_users::add_user',
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
  CLIPBOARD_INFO: {
    NAME: 's3-name',
    DESCRIPTION: 'description',
    ACCESS_KEY: 's3-access-key',
    SECRET_KEY: 's3-secret-key',
  },
};
