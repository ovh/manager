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
    [GIT_STATUS.disabled]: 'disabled',
    [GIT_STATUS.initialError]: 'lastDeploy',
    [GIT_STATUS.error]: 'lastDeploy',
    [GIT_STATUS.deleting]: 'lastDeploy',
  },
  limitedPath: {
    [GIT_STATUS.disabled]: 'disabled',
    [GIT_STATUS.initialError]: 'lastDeploy',
    [GIT_STATUS.error]: 'limitedNumberPath',
    [GIT_STATUS.deploying]: 'limitedNumberPath',
    [GIT_STATUS.deleting]: 'lastDeploy',
  },
};

export const DIAGNOSTIC_BADGE_STATE = {
  good_configuration: 'success',
  not_good_configuration: 'warning',
  unconfigured: 'sold-out',
};

export const DIAGNOSTIC_STATUS = {
  GOOD_CONFIGURATION: 'good_configuration',
  NOT_GOOD_CONFIGURATION: 'not_good_configuration',
  UNCONFIGURED: 'unconfigured',
};

export const HOSTING_TAB_DOMAINS = {
  A_RECORD: 'A',
  AAAA_RECORD: 'AAAA',
};

export const RECORD_TYPE_TO_HOSTING_IP = {
  A: 'hostingIp',
  AAAA: 'hostingIpv6',
};

export const RECORD_TYPE_TO_IP_TYPE = {
  A: 'IpV4',
  AAAA: 'IpV6',
};

export default {
  DIAGNOSTIC_BADGE_STATE,
  DIAGNOSTIC_STATUS,
  HOSTING_TAB_DOMAINS,
  RECORD_TYPE_TO_IP_TYPE,
  RECORD_TYPE_TO_HOSTING_IP,
  HOSTING_OFFER,
  CDN_STATUS,
  CDN_VERSION,
  CDN_TYPE,
  GIT_BADGES_STATUS,
  GIT_STATUS,
  GIT_STATUS_WITH_TOOLTIP,
};
