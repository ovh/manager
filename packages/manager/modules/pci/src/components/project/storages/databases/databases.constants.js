export const STATUS = {
  CREATING: 'CREATING',
  DELETING: 'DELETING',
  ERROR: 'ERROR',
  ERROR_SPEC: 'ERROR_INCONSISTENT_SPEC',
  PENDING: 'PENDING',
  READY: 'READY',
  UPDATING: 'UPDATING',
};

export const DISK_TYPE = {
  LOCAL_SSD: 'local-ssd',
  HIGH_SPEED: 'high-speed',
  HIGH_SPEED_GEN_2: 'high-speed-gen2',
};

export const SSL_MODE_REQUIRED = ['require', 'required', 'REQUIRED'];

export const SSL_MODE_NA = ['n/a'];

export const SSL_MODE_SSL_TLS = ['TLS/SSL'];

export default {
  STATUS,
  SSL_MODE_REQUIRED,
  SSL_MODE_NA,
  SSL_MODE_SSL_TLS,
  DISK_TYPE,
};
