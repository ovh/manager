export const MAXIMUM_SNAPSHOT_ALLOWED = 50;

export const SNAPSHOT_TYPE = {
  AUTOMATIC: 'automatic',
  MANUAL: 'manual',
  SYSTEM: 'system',
};

export const SNAPSHOT_TRACKING_PREFIX =
  'Storage_backup::storage_backup::netapp::';
export const SNAPSHOT_LISTING_TRACKING_CONTEXT = {
  page: { name: `${SNAPSHOT_TRACKING_PREFIX}volumes::listing::snapshots` },
  page_theme: 'Storage_backup',
  page_category: 'pop-up',
  level2: 130,
};

export const STATUS = {
  ACTIVE: [
    'available',
    'manage_starting',
    'manage_error',
    'unmanage_starting',
    'unmanage_error',
  ],
  INACTIVE: ['error'],
  PENDING: ['creating', 'deleting', 'restoring'],
};

export const SNAPSHOT_STATUS = {
  AVAILABLE: 'available',
  MANAGE_ERROR: 'manage_error',
};

export const FETCH_INTERVAL = 1000;

export default {
  MAXIMUM_SNAPSHOT_ALLOWED,
  SNAPSHOT_TYPE,
  STATUS,
  SNAPSHOT_STATUS,
  FETCH_INTERVAL,
  SNAPSHOT_TRACKING_PREFIX,
  SNAPSHOT_LISTING_TRACKING_CONTEXT,
};
