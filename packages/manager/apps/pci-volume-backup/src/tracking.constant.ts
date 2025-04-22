export const LEVEL2 = {
  EU: {
    config: {
      level2: '86',
    },
  },
  CA: {
    config: {
      level2: '86',
    },
  },
  US: {
    config: {
      level2: '86',
    },
  },
};
export const UNIVERSE = 'PublicCloud';
export const SUB_UNIVERSE = 'storages';
export const APP_NAME = 'volume-backup';
export const VOLUME_BACKUP_BASE_TRACKING =
  'pci::projects::project::storages::volume-backup';
export const VOLUME_BACKUP_CTA_TRACKING = `PublicCloud::${VOLUME_BACKUP_BASE_TRACKING}`;
export const GUIDES_STORAGES_VOLUME_BACKUP_OVERVIEW =
  'storages_volume_backup_overview';

export const VOLUME_BACKUP_TRACKING = {
  GUIDES: 'public-cloud_volume_backup::guides::go_to',
  ONBOARDING: {
    PAGE: `${VOLUME_BACKUP_BASE_TRACKING}::onboarding`,
    ADD: `${VOLUME_BACKUP_CTA_TRACKING}::onboarding::add`,
    GUIDE: `${VOLUME_BACKUP_CTA_TRACKING}::onboarding::docs`,
  },
  CREATE: {
    PAGE: `${VOLUME_BACKUP_BASE_TRACKING}::create-backup`,
    PRICE_LINK: `${VOLUME_BACKUP_CTA_TRACKING}::create-backup::guide_${GUIDES_STORAGES_VOLUME_BACKUP_OVERVIEW}`,
    CTA_CONFIRM: `${VOLUME_BACKUP_CTA_TRACKING}::create-backup::confirm`,
    REQUEST_FAIL: `${VOLUME_BACKUP_CTA_TRACKING}::create-backup_error`,
    REQUEST_SUCCESS: `${VOLUME_BACKUP_CTA_TRACKING}::create-backup_success`,
  },
  LISTING: {
    PAGE: `${VOLUME_BACKUP_BASE_TRACKING}`,
    ADD: `${VOLUME_BACKUP_CTA_TRACKING}::add`,
    ROW_CTA_RESTORE_VOLUME: `${VOLUME_BACKUP_CTA_TRACKING}::table-option-menu::restore-volume`,
    ROW_CTA_CREATE_VOLUME: `${VOLUME_BACKUP_CTA_TRACKING}::table-option-menu::create-volume`,
    ROW_CTA_DELETE_VOLUME: `${VOLUME_BACKUP_CTA_TRACKING}::table-option-menu::delete-volume`,
  },
  RESTORE_VOLUME: {
    PAGE: 'restore',
    CTA_CANCEL: 'cancel',
    CTA_CONFIRM: 'confirm',
    REQUEST_FAIL: 'restore_error',
    REQUEST_SUCCESS: 'restore_success',
  },
  CREATE_VOLUME: {
    PAGE: `${VOLUME_BACKUP_BASE_TRACKING}::create-volume`,
    CTA_CANCEL: `${VOLUME_BACKUP_CTA_TRACKING}::create-volume::cancel`,
    CTA_CONFIRM: `${VOLUME_BACKUP_CTA_TRACKING}::create-volume::confirm`,
    REQUEST_FAIL: `${VOLUME_BACKUP_CTA_TRACKING}::create-volume_error`,
    REQUEST_SUCCESS: `${VOLUME_BACKUP_CTA_TRACKING}::create-volume_success`,
  },
  DELETE_BACKUP: {
    PAGE: `${VOLUME_BACKUP_BASE_TRACKING}::delete`,
    CTA_CANCEL: `${VOLUME_BACKUP_CTA_TRACKING}::delete::cancel`,
    CTA_CONFIRM: `${VOLUME_BACKUP_CTA_TRACKING}::delete::confirm`,
    REQUEST_FAIL: `${VOLUME_BACKUP_CTA_TRACKING}::delete_error`,
    REQUEST_SUCCESS: `${VOLUME_BACKUP_CTA_TRACKING}::delete_success`,
  },
};
