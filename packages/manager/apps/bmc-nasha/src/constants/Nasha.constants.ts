export const NASHA_ALERT_ID = 'nasha_alert';
export const NASHA_BASE_API_URL = '/dedicated/nasha';
export const NASHA_TITLE = 'NAS-HA';
export const NASHA_USE_SIZE_NAME = 'size';
export const NASHA_DEFAULT_ZFS_OPTIONS = {
  atime: 'off',
  recordsize: '131072',
  sync: 'standard',
} as const;

export const PREFIX_TRACKING_NASHA = 'nasha';
export const PREFIX_TRACKING_DASHBOARD = 'dashboard';
export const PREFIX_TRACKING_DASHBOARD_PARTITIONS = `${PREFIX_TRACKING_DASHBOARD}::nasha-partitions`;
export const SERVICE_TYPE = 'DEDICATED_NASHA';

export const SIZE_MIN = 10; // Minimum partition size in GB
