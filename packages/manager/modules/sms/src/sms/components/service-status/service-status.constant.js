export const SMPP_STATUS = {
  ERROR: 'ERROR',
  OK: 'OK',
  INSTALLING: 'INSTALLING',
  UPDATING_IPS: 'UPDATING_IPS',
};

export const SMPP_BADAGES_STATUS = {
  [SMPP_STATUS.ERROR]: 'oui-badge_error',
  [SMPP_STATUS.OK]: 'oui-badge_success',
  [SMPP_STATUS.INSTALLING]: 'oui-badge_info',
  [SMPP_STATUS.UPDATING_IPS]: 'oui-badge_info',
};

export default {
  SMPP_STATUS,
  SMPP_BADAGES_STATUS,
};
