export const TRACKING_OCTAVIA_LOAD_BALANCERS_PREFIX =
  'PublicCloud::pci::projects::project::octavia-loadbalancer';

const SUCCESS_BADGE_CLASS = 'oui-badge_success';
const WARNING_BADGE_CLASS = 'oui-badge_warning';
const ERROR_BADGE_CLASS = 'oui-badge_error';

export const PROVISIONING_STATUS_BADGES = {
  active: SUCCESS_BADGE_CLASS,
  deleted: SUCCESS_BADGE_CLASS,
  creating: WARNING_BADGE_CLASS,
  deleting: WARNING_BADGE_CLASS,
  updating: WARNING_BADGE_CLASS,
  error: ERROR_BADGE_CLASS,
};

export const OPERATING_STATUS_BADGES = {
  online: SUCCESS_BADGE_CLASS,
  offline: WARNING_BADGE_CLASS,
  degraded: WARNING_BADGE_CLASS,
  draining: WARNING_BADGE_CLASS,
  noMonitor: WARNING_BADGE_CLASS,
  error: ERROR_BADGE_CLASS,
};

export default {
  TRACKING_OCTAVIA_LOAD_BALANCERS_PREFIX,
  PROVISIONING_STATUS_BADGES,
  OPERATING_STATUS_BADGES,
};
