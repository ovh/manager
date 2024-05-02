const NODE_STATE = {
  OK: 'OK',
  ERROR: 'ERROR',
  HACKED: 'HACKED',
  HACKED_BLOCKED: 'HACKED_BLOCKED',
};

export const NODE_BADGE_STATE = {
  [NODE_STATE.OK]: 'oui-badge_success',
  [NODE_STATE.ERROR]: 'oui-badge_warning',
  [NODE_STATE.HACKED]: 'oui-badge_error',
  [NODE_STATE.HACKED_BLOCKED]: 'oui-badge_error',
};

export default {
  NODE_BADGE_STATE,
};
