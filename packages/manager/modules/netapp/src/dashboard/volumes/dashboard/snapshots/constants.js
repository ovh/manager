export const MAXIMUM_SNAPSHOT_ALLOWED = 50;

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

export default {
  MAXIMUM_SNAPSHOT_ALLOWED,
  STATUS,
};
