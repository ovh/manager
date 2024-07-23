export const HOSTING_OFFER = {
  STARTER_OVH: 'HOSTING_STARTER_OVH',
  STARTER: 'HOSTING_STARTER',
  FREE_100_M: 'HOSTING_FREE_100_M',
};

export const CDN_STATUS = {
  ACTIVE: 'ACTIVE',
};

export const CDN_VERSION = {
  CDN_HOSTING: 'cdn-hosting',
};

export const CDN_TYPE = {
  BASIC: 'cdn-basic',
  SECURITY: 'cdn-security',
  ADVANCED: 'cdn-advanced',
};

export const GIT_BADGES_STATUS = {
  created: 'oui-badge_success',
  creating: 'oui-badge_info',
  deleting: 'oui-badge_error',
  disabled: 'oui-badge_error',
  error: 'oui-badge_warning',
  deploying: 'oui-badge_info',
  initialError: 'oui-badge_warning',
};

export const GIT_STATUS = {
  created: 'created',
  creating: 'creating',
  deleting: 'deleting',
  disabled: 'disabled',
  error: 'error',
  deploying: 'deploying',
  initialError: 'initialError',
};

export const GIT_STATUS_WITH_TOOLTIP = {
  unlimitedPath: {
    [GIT_STATUS.created]: 'lastDeploy',
    [GIT_STATUS.initialError]: 'lastDeploy',
    [GIT_STATUS.error]: 'lastDeploy',
    [GIT_STATUS.deleting]: 'lastDeploy',
  },
  limitedPath: {
    [GIT_STATUS.created]: 'limitedNumberPath',
    [GIT_STATUS.initialError]: 'lastDeploy',
    [GIT_STATUS.error]: 'limitedNumberPath',
    [GIT_STATUS.deploying]: 'limitedNumberPath',
    [GIT_STATUS.deleting]: 'lastDeploy',
  },
};

export const DIAGNOSTIC_STATE = {
  ERROR: 'error',
  INFO: 'info',
  SUCCESS: 'success',
  DISABLED: 'disabled',
  DISABLED_GREY: 'sold-out',
};

export const HOSTING_TAB_DOMAINS = {
  A_RECORD: 'A',
  AAAA_RECORD: 'AAAA',
};

export default {
  DIAGNOSTIC_STATE,
  HOSTING_TAB_DOMAINS,
  HOSTING_OFFER,
  CDN_STATUS,
  CDN_VERSION,
  CDN_TYPE,
  GIT_BADGES_STATUS,
  GIT_STATUS,
  GIT_STATUS_WITH_TOOLTIP,
};
