export const DOMAIN_STATUS = {
  OK: 'ok',
  EXPIRED: 'expired',
  RESTORABLE: 'restorable',
  DELETED: 'deleted',
  PENDING_DELETE: 'pending_delete',
  PENDING_OUTGOING_TRANSFER: 'pending_outgoing_transfer',
  DISPUTE: 'dispute',
  PENDING_CREATE: 'pending_create',
  PENDING_INSTALLATION: 'pending_installation',
  PENDING_INCOMING_TRANSFER: 'pending_incoming_transfer',
  TECHNICAL_SUSPENDED: 'technical_suspended',
  REGISTRY_SUSPENDED: 'registry_suspended',
};

export const DOMAIN_SUSPENSION_STATE = {
  NOT_SUSPENDED: 'not_suspended',
  SUSPENDED: 'suspended',
};

export const DOMAIN_TRANSFERT_LOCK_STATE = {
  LOCKED: 'locked',
  LOCKING: 'locking',
  UNAVAILABLE: 'unavailable',
  UNLOCKED: 'unlocked',
  UNLOCKING: 'unlocking',
};

export const DOMAIN_NAME_SERVER_TYPE = {
  HOSTED_BY: 'hosted by',
  EXTERNAL: 'external',
};

export const DOMAINS_BADGES_STATUS = {
  [DOMAIN_STATUS.OK]: 'oui-badge_success',
  [DOMAIN_STATUS.EXPIRED]: 'oui-badge_warning',
  [DOMAIN_STATUS.RESTORABLE]: 'oui-badge_warning',
  [DOMAIN_STATUS.DELETED]: 'oui-badge_error',
  [DOMAIN_STATUS.PENDING_DELETE]: 'oui-badge_error',
  [DOMAIN_STATUS.PENDING_OUTGOING_TRANSFER]: 'oui-badge_warning',
  [DOMAIN_STATUS.DISPUTE]: 'oui-badge_limited-edition',
  [DOMAIN_STATUS.PENDING_INSTALLATION]: 'oui-badge_info',
  [DOMAIN_STATUS.PENDING_CREATE]: 'oui-badge_info',
  [DOMAIN_STATUS.PENDING_INCOMING_TRANSFER]: 'oui-badge_info',
  [DOMAIN_STATUS.TECHNICAL_SUSPENDED]: 'oui-badge_limited-edition',
  [DOMAIN_STATUS.REGISTRY_SUSPENDED]: 'oui-badge_limited-edition',
};

export const DOMAINS_BADGES_SUSPENSION_STATE = {
  [DOMAIN_SUSPENSION_STATE.NOT_SUSPENDED]: 'oui-badge_success',
  [DOMAIN_SUSPENSION_STATE.SUSPENDED]: 'oui-badge_warning',
};

export const DOMAINS_BADGES_TRANSFERT_LOCK_STATE = {
  [DOMAIN_TRANSFERT_LOCK_STATE.LOCKED]: 'oui-badge_success',
  [DOMAIN_TRANSFERT_LOCK_STATE.LOCKING]: 'oui-badge_warning',
  [DOMAIN_TRANSFERT_LOCK_STATE.UNAVAILABLE]: 'oui-badge_sold-out',
  [DOMAIN_TRANSFERT_LOCK_STATE.UNLOCKED]: 'oui-badge_warning',
  [DOMAIN_TRANSFERT_LOCK_STATE.UNLOCKING]: 'oui-badge_warning',
};

export const IDN_PREFIX = 'xn--';

export default {
  DOMAIN_STATUS,
  DOMAIN_SUSPENSION_STATE,
  DOMAIN_TRANSFERT_LOCK_STATE,
  DOMAIN_NAME_SERVER_TYPE,
  DOMAINS_BADGES_STATUS,
  DOMAINS_BADGES_SUSPENSION_STATE,
  DOMAINS_BADGES_TRANSFERT_LOCK_STATE,
  IDN_PREFIX,
};
