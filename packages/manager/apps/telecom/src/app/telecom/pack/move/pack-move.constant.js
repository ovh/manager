const ELIGIBILITY_LINE_STATUS = {
  active: 'active',
  create: 'create',
  inactive: 'inactive',
};

const LINE_STATUS = {
  slamming: 'notification',
};

const OFFER_TYPE = {
  adsl: 'ADSL',
  sdsl: 'SDSL',
  ftth: 'FTTH',
};

const STEPS = {
  eligibility: 'eligibility',
  offers: 'offers',
  unbundling: 'unbundling',
  saveNumber: 'saveNumber',
  buildingDetails: 'buildingDetails',
  serviceDelete: 'serviceDelete',
  shipping: 'shipping',
  meeting: 'meeting',
  resume: 'resume',
};

const UNBUNDLING = {
  partial: 'partial',
  total: 'full',
};

const PROMO_DISPLAY = {
  PROMO_FTTH_2020: 'FTTH_MIGRATION_AND_ADRESSMOVE_2020',
  P3M: {
    key: 'P3M',
    value: 3,
  },
};

const MODEM_LIST = ['yes', 'recycled'];

const MODEM_OPTION_NAME = 'modem';

const OFFER_TYPE_XDSL = 'xdsl';

const FIBER_PTO = {
  FIBER_PTO_YES: 'yes',
  FIBER_PTO_YES_BUT_NOT_KNOWN: 'yesNotKnown',
  FIBER_PTO_NO: 'no',
  FIBER_PTO_MULTI_OTP: 'multiOtp',
};

const INSTALLATION_TYPE = {
  activate: 'activate',
  activate_undefined: 'activate_undefined',
  create: 'create',
  multiOtp: 'multiOtp',
};

const DICTIONNARY = {
  [FIBER_PTO.FIBER_PTO_YES]: INSTALLATION_TYPE.activate,
  [FIBER_PTO.FIBER_PTO_YES_BUT_NOT_KNOWN]: INSTALLATION_TYPE.activate_undefined,
  [FIBER_PTO.FIBER_PTO_NO]: INSTALLATION_TYPE.create,
  [FIBER_PTO.FIBER_PTO_MULTI_OTP]: INSTALLATION_TYPE.multiOtp,
};

export {
  ELIGIBILITY_LINE_STATUS,
  LINE_STATUS,
  OFFER_TYPE,
  STEPS,
  UNBUNDLING,
  PROMO_DISPLAY,
  MODEM_LIST,
  MODEM_OPTION_NAME,
  OFFER_TYPE_XDSL,
  FIBER_PTO,
  INSTALLATION_TYPE,
  DICTIONNARY,
};
