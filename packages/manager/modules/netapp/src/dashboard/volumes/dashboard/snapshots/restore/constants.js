export const SNAPSHOT_TYPE = {
  AUTOMATIC: 'automatic',
  MANUAL: 'manual',
  SYSTEM: 'system'
}

export const SNAPSHOT_STATUS = {
  AVAILABLE: 'available',
  CREATING: 'creating',
  DELETING: 'deleting',
  ERROR: 'error',
  ERROR_DELETING: 'error_deleting',
  MANAGE_ERROR: 'manage_error',
  MANAGE_STARTING: 'manage_starting',
  RESTORING: 'restoring',
  UNMANAGE_ERROR: 'unmanage_error',
  UNMANAGE_STARTING: 'unmanage_starting'
}

export const FETCH_INTERVAL = 5000;

export default {
  SNAPSHOT_TYPE,
  SNAPSHOT_STATUS,
  FETCH_INTERVAL
}
