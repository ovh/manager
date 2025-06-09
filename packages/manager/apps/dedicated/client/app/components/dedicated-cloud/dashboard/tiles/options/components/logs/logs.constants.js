export const COMPATIBILITY_MATRIX_LOGS_NAME = 'logForwarder';

export const LOGS_ACTIONS = {
  ACTIVATE: 'activate',
  DEACTIVATE: 'deactivate',
};

/* mapping of /dedicatedCloud/{serviceName}/securityOptions/compatibilityMatrix state ENUM field */
export const LOGS_COMPATIBILITY_STATE = {
  creating: {
    badgeType: 'info',
    actions: [],
  },
  deleted: {
    badgeType: 'error',
    actions: [LOGS_ACTIONS.ACTIVATE],
  },
  deleting: {
    badgeType: 'info',
    actions: [],
  },
  delivered: {
    badgeType: 'success',
    actions: [LOGS_ACTIONS.DEACTIVATE],
  },
  disabled: {
    badgeType: 'warning',
    actions: [LOGS_ACTIONS.ACTIVATE],
  },
  pending: {
    badgeType: 'info',
    actions: [],
  },
  toCreate: {
    badgeType: 'info',
    actions: [],
  },
  updating: {
    badgeType: 'info',
    actions: [],
  },
};
