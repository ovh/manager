export const ACCOUNT_INFORMATIONS = {
  FR: 'https://docs.ovh.com/fr/customer/',
  GB: 'https://docs.ovh.com/gb/en/customer/',
  DE: 'https://docs.ovh.com/de/customer/',
  ES: 'https://docs.ovh.com/es/customer/',
  IT: 'https://docs.ovh.com/it/customer/',
  PL: 'https://docs.ovh.com/pl/customer/',
  PT: 'https://docs.ovh.com/pt/customer/',
  IE: 'https://docs.ovh.com/ie/en/customer/',
  DEFAULT: 'https://docs.ovh.com/gb/en/customer/',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/categories/115000423470-My-Account',
  ASIA: 'https://docs.ovh.com/asia/en/customer/',
  AU: 'https://docs.ovh.com/au/en/customer/',
  CA: 'https://docs.ovh.com/ca/en/customer/',
  QC: 'https://docs.ovh.com/ca/fr/customer/',
  SG: 'https://docs.ovh.com/sg/en/customer/',
  WE: 'https://docs.ovh.com/us/en/customer/',
  WS: 'https://docs.ovh.com/us/es/customer/',
  MA: 'https://docs.ovh.com/fr/customer/',
  TN: 'https://docs.ovh.com/fr/customer/',
  SN: 'https://docs.ovh.com/fr/customer/',
  IN: 'https://docs.ovh.com/asia/en/customer/',
};

export const SUPPORT_URLS = {
  createTicket: 'https://help.ovhcloud.com/csm?id=csm_get_help&ovhSubsidiary=',
  viewTickets:
    'https://help.ovhcloud.com/csm?id=csm_cases_requests&ovhSubsidiary=',
};

export const GUIDES_LIST = {
  account_informations: {
    url: ACCOUNT_INFORMATIONS,
    key: 'account_informations_guides',
    tracking: 'billing_my_account::guides::account_informations',
  },
};

export default {
  GUIDES_LIST,
  SUPPORT_URLS,
  ACCOUNT_INFORMATIONS,
};
