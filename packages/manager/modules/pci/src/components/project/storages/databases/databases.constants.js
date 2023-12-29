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

export const OLD_MONGODB_PLANS = ['essential', 'business', 'enterprise'];

export const PLANS_WITHOUT_BACKUP = ['discovery'];

export default {
  STATUS,
  DISK_TYPE,
  OLD_MONGODB_PLANS,
  PLANS_WITHOUT_BACKUP,
};
