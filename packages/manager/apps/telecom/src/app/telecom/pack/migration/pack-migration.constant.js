export const PROMO_DISPLAY = {
  PROMO_FTTH_2020: 'FTTH_MIGRATION_AND_ADRESSMOVE_2020',
  P3M: {
    key: 'P3M',
    value: 3,
  },
};

export const PROCESS_STEP = {
  buildings: 'buildings',
  migration: 'migration',
  offers: 'offers',
  buildingDetails: 'buildingDetails',
  confirm: 'confirm',
  shipping: 'shipping',
  meeting: 'meeting',
  ontShipping: 'ontShipping',
  serviceDelete: 'serviceDelete',
};

export const QUANTITY = 1;

export const MODEM_LIST = ['yes', 'recycled'];

export const MODEM_OPTION_NAME = 'modem';

export const GTR_NONE = 'none';
export const OFFER_XDSL = 'xdsl';
export const OFFER_FIBER = 'fiber';

export const GRT = 'grt';
export const CONTEXT = {
  migration: 'migration',
  voipline: 'voipLine',
};

export const CUSTOM_FIELD_FORM = [
  'firstName',
  'lastName',
  'address',
  'cityName',
  'zipCode',
];

export const CUSTOM_SORT_FIELD_FORM = {
  generalInformations: ['firstName', 'lastName'],
  profile: ['address', 'cityName', 'zipCode'],
};

export const CUSTOM_FIELD_FORM_RULES = {
  firstName: { canBeNull: false },
  lastName: { canBeNull: false },
  address: { canBeNull: false },
  cityName: { canBeNull: false },
  zipCode: { canBeNull: false },
};

export default {
  PROMO_DISPLAY,
  PROCESS_STEP,
  QUANTITY,
  MODEM_LIST,
  MODEM_OPTION_NAME,
  GTR_NONE,
  OFFER_XDSL,
  OFFER_FIBER,
  GRT,
  CONTEXT,
  CUSTOM_FIELD_FORM,
  CUSTOM_SORT_FIELD_FORM,
  CUSTOM_FIELD_FORM_RULES,
};
