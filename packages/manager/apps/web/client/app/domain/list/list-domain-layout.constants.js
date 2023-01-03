export const DOMAIN_STATUS = {
  OK: 'ok',
  EXPIRED: 'expired',
  RESTORABLE: 'restorable',
  DELETED: 'deleted',
  PENDING_DELETE: 'pending_delete',
  OUTGOING_TRANSFER: 'outgoing_transfer',
  DISPUTE: 'dispute',
};

export const DOMAIN_TECH_STATE = {
  NOT_SUSPENDED: 'not_suspended',
  SUSPENDED: 'suspended',
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
  UNAVAILABLE: 'unavailable',
};

export const DOMAIN_NAME_SERVER_TYPE = {
  HOSTED_BY: 'hosted by',
  EXTERNAL: 'external',
};
export default {
  DOMAIN_STATUS,
  DOMAIN_TECH_STATE,
  DOMAIN_NAME_SERVER_TYPE,
};
