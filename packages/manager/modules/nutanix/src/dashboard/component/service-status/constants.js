export const SERVICE_STATE = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  UNKNOWN: 'unknown',
};

export const SERVICE_BADGE_STATE = {
  [SERVICE_STATE.ACTIVE]: 'oui-badge_success',
  [SERVICE_STATE.SUSPENDED]: 'oui-badge_warning',
  [SERVICE_STATE.UNKNOWN]: 'oui-badge_success',
};

export default {
  SERVICE_STATE,
  SERVICE_BADGE_STATE,
};
