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

export const VOLUME_BACKUP_TRACKING = {
  GUIDE: ['page', 'tile-tutorial'],
  CHANGELOG: ['page', 'tile-tutorial'],
  ONBOARDING: {
    ADD: ['page', 'button', 'create_volume-backup'],
  },
  CREATE: {
    PAGE_NAME: 'create_volume-backup',
    KNOW_MORE_LINK: [
      'funnel',
      'external-link',
      'create_volume-backup',
      'go-to-know-more-backup',
    ],
    CARD_CLICK: ['funnel', 'tile', 'create_volume-backup', 'select_volume'],
    CTA_CONFIRM_BACKUP: [
      'funnel',
      'button',
      'create_volume-backup',
      'confirm',
      'volume-backup_create_volume_backup',
    ],
    CTA_CONFIRM_SNAPSHOT: [
      'funnel',
      'button',
      'create_volume-backup',
      'confirm',
      'volume-backup_create_volume_snapshot',
    ],
    REQUEST_FAIL: `create_volume-backup_error`,
    REQUEST_SUCCESS: `create_volume-backup_success`,
  },
  DETACH_VOLUME: {
    PAGE_NAME: 'detach_volume',
    CTA_CANCEL: ['pop-up', 'button', 'detach_volume', 'cancel'],
    CTA_CONFIRM: ['pop-up', 'button', 'detach_volume', 'confirm'],
    REQUEST_FAIL: 'detach_volume_error',
    REQUEST_SUCCESS: 'detach_volume_success',
  },
  LISTING: {
    ADD: ['page', 'button', 'create_volume-backup'],
    ROW_CTA_RESTORE_VOLUME: ['datagrid', 'button', 'restore_volume-backup'],
    ROW_CTA_CREATE_VOLUME: ['datagrid', 'button', 'create_volume'],
    ROW_CTA_DELETE_VOLUME: ['datagrid', 'button', 'delete_volume-backup'],
  },
  RESTORE_VOLUME: {
    PAGE_NAME: 'restore_volume-backup',
    CTA_CANCEL: ['pop-up', 'button', 'restore_volume-backup', 'cancel'],
    CTA_CONFIRM: ['pop-up', 'button', 'restore_volume-backup', 'confirm'],
    REQUEST_FAIL: 'restore_volume-backup_error',
    REQUEST_SUCCESS: 'restore_volume-backup_success',
  },
  CREATE_VOLUME: {
    PAGE_NAME: 'create_volume',
    CTA_CANCEL: ['funnel', 'button', 'create_volume', 'cancel'],
    CTA_CONFIRM: ['funnel', 'button', 'create_volume', 'confirm'],
    REQUEST_FAIL: 'create_volume_error',
    REQUEST_SUCCESS: 'create_volume_success',
  },
  DELETE_BACKUP: {
    PAGE_NAME: 'delete_volume-backup',
    CTA_CANCEL: ['pop-up', 'button', 'delete_volume-backup', 'cancel'],
    CTA_CONFIRM: ['pop-up', 'button', 'delete_volume-backup', 'confirm'],
    REQUEST_FAIL: 'delete_volume-backup_error',
    REQUEST_SUCCESS: 'delete_volume-backup_success',
  },
};
