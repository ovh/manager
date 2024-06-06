export const OPTION_NAME = 'voip_line';

export const MODEM_LIST = ['yes', 'recycled'];

export const FIBER_PTO = {
  FIBER_PTO_YES: 'yes',
  FIBER_PTO_YES_BUT_NOT_KNOWN: 'yesNotKnown',
  FIBER_PTO_NO: 'no',
  FIBER_PTO_MULTI_OTP: 'multiOtp',
};

export const INSTALL_TYPE = {
  activate: 'activate',
  activate_undefined: 'activate_undefined',
  create: 'create',
  multi_otp: 'multiOtp',
};

export const DICTIONNARY = {
  [FIBER_PTO.FIBER_PTO_YES]: INSTALL_TYPE.activate,
  [FIBER_PTO.FIBER_PTO_YES_BUT_NOT_KNOWN]: INSTALL_TYPE.activate_undefined,
  [FIBER_PTO.FIBER_PTO_NO]: INSTALL_TYPE.create,
  [FIBER_PTO.FIBER_PTO_MULTI_OTP]: INSTALL_TYPE.multi_otp,
};

export default {
  OPTION_NAME,
  MODEM_LIST,
  FIBER_PTO,
  INSTALL_TYPE,
  DICTIONNARY,
};
