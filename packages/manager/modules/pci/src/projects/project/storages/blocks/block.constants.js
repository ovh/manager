export const VOLUME_MAX_SIZE = 4 * 1000; // Should be 10 * 1024 (but API is wrong;
export const VOLUME_MIN_SIZE = 10; // 10 Gio
export const VOLUME_UNLIMITED_QUOTA = -1; // Should be 10 * 1024 (but API is wrong)

export const VOLUME_ADDON_FAMILY = 'volume';
export const VOLUME_SNAPSHOT_CONSUMPTION = 'volume.snapshot.consumption';

export const VOLUME_HELP_PREFERENCE_KEY =
  'PCI_PROJECTS_STORAGES_BLOCKS_HELP_SHOW_';

export const VOLUME_BLOCK_BASE_TRACKING =
  'pci::projects::project::storages::blocks';

export const VOLUME_BLOCK_CTA_TRACKING = `PublicCloud::${VOLUME_BLOCK_BASE_TRACKING}`;

export const VOLUME_BLOCK_TRACKING = {
  ONBOARDING: {
    PAGE: `${VOLUME_BLOCK_BASE_TRACKING}::onboarding`,
    ADD: `${VOLUME_BLOCK_CTA_TRACKING}::onboarding::add`,
    GUIDE: `${VOLUME_BLOCK_CTA_TRACKING}::onboarding::docs`,
  },
  CREATE: {
    PAGE: `${VOLUME_BLOCK_BASE_TRACKING}::create-backup`,
    GUIDE: `${VOLUME_BLOCK_CTA_TRACKING}::create-backup::guide`,
    CTA_CONFIRM: `${VOLUME_BLOCK_CTA_TRACKING}::create-backup::confirm`,
    CTA_CANCEL: `${VOLUME_BLOCK_CTA_TRACKING}::create-backup::cancel`,
    REQUEST_FAIL: `${VOLUME_BLOCK_CTA_TRACKING}::create-backup_error`,
    REQUEST_SUCCESS: `${VOLUME_BLOCK_CTA_TRACKING}::create-backup_success`,
  },
  DETACH_VOLUME: {
    PAGE: `${VOLUME_BLOCK_BASE_TRACKING}::detach-volume`,
    CTA_CONFIRM: `${VOLUME_BLOCK_CTA_TRACKING}::detach-volume::confirm`,
    CTA_CANCEL: `${VOLUME_BLOCK_CTA_TRACKING}::detach-volume::cancel`,
    REQUEST_FAIL: `${VOLUME_BLOCK_CTA_TRACKING}::detach-volume_error`,
    REQUEST_SUCCESS: `${VOLUME_BLOCK_CTA_TRACKING}::detach-volume_success`,
  },
  LISTING: {
    PAGE: `${VOLUME_BLOCK_BASE_TRACKING}`,
    CTA_CREATE: `${VOLUME_BLOCK_CTA_TRACKING}::add`,
    ROW_CTA_DETACH_VOLUME: `${VOLUME_BLOCK_CTA_TRACKING}::table-option-menu::detach-volume`,
    ROW_CTA_EDIT: `${VOLUME_BLOCK_CTA_TRACKING}::table-option-menu::edit`,
    ROW_CTA_ATTACH: `${VOLUME_BLOCK_CTA_TRACKING}::table-option-menu::attach`,
    ROW_CTA_CREATE_BACKUP: `${VOLUME_BLOCK_CTA_TRACKING}::table-option-menu::create-backup`,
    ROW_CTA_DELETE: `${VOLUME_BLOCK_CTA_TRACKING}::table-option-menu::delete`,
  },
};

export default {
  VOLUME_MAX_SIZE,
  VOLUME_MIN_SIZE,
  VOLUME_UNLIMITED_QUOTA,
  VOLUME_ADDON_FAMILY,
  VOLUME_SNAPSHOT_CONSUMPTION,
  VOLUME_HELP_PREFERENCE_KEY,
  VOLUME_BLOCK_TRACKING,
};
