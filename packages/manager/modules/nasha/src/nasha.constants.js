export const NASHA_ACL_TYPE_ENUM = 'dedicated.storage.AclTypeEnum';
export const NASHA_ALERT_ID = 'nasha_alert';
export const NASHA_BASE_API_URL = '/dedicated/nasha';
export const NASHA_PROTOCOL_ENUM = 'dedicated.storage.ProtocolEnum';
export const NASHA_RECORD_SIZE_ENUM = 'dedicated.storage.RecordSizeEnum';
export const NASHA_SNAPSHOT_ENUM = 'dedicated.storage.SnapshotEnum';
export const NASHA_SYNC_ENUM = 'dedicated.storage.SyncEnum';
export const NASHA_TITLE = 'NAS-HA';
export const NASHA_USE_SIZE_NAME = 'size';

export const NASHA_DEFAULT_ZFS_OPTIONS = {
  atime: 'off',
  recordsize: '131072',
  sync: 'standard',
};

export const PREFIX_TRACKING_NASHA = 'nasha';

export default {
  NASHA_ACL_TYPE_ENUM,
  NASHA_ALERT_ID,
  NASHA_BASE_API_URL,
  NASHA_DEFAULT_ZFS_OPTIONS,
  NASHA_PROTOCOL_ENUM,
  NASHA_RECORD_SIZE_ENUM,
  NASHA_SNAPSHOT_ENUM,
  NASHA_SYNC_ENUM,
  NASHA_TITLE,
  NASHA_USE_SIZE_NAME,
  PREFIX_TRACKING_NASHA,
};
