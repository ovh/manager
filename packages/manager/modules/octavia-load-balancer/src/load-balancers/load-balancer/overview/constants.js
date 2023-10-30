export const PROVISIONING_STATUS_BADGES = {
  active: 'oui-badge_success',
  deleted: 'oui-badge_success',
  creating: 'oui-badge_warning',
  deleting: 'oui-badge_warning',
  updating: 'oui-badge_warning',
  error: 'oui-badge_error',
};

export const OPERATING_STATUS_BADGES = {
  online: 'oui-badge_success',
  offline: 'oui-badge_warning',
  degraded: 'oui-badge_warning',
  draining: 'oui-badge_warning',
  noMonitor: 'oui-badge_warning',
  error: 'oui-badge_error',
};

export default { PROVISIONING_STATUS_BADGES, OPERATING_STATUS_BADGES };
