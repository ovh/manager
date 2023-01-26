export const SMPP_STATUS = {
  DELETED: 'DELETED',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  UNKNOWN: 'UNKNOWN',
  UPDATING_IP: 'UPDATING_IP',
  WAITING_IP: 'WAITING_IP',
};

export const SMPP_BADAGES_STATUS = {
  [SMPP_STATUS.DELETED]: 'oui-badge_error',
  [SMPP_STATUS.ERROR]: 'oui-badge_error',
  [SMPP_STATUS.SUCCESS]: 'oui-badge_success',
  [SMPP_STATUS.UNKNOWN]: 'oui-badge_error',
  [SMPP_STATUS.UPDATING_IP]: 'oui-badge_info',
  [SMPP_STATUS.WAITING_IP]: 'oui-badge_info',
};

export default {
  SMPP_STATUS,
  SMPP_BADAGES_STATUS,
};
