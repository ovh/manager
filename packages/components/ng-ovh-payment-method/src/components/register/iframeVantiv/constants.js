export const THREAT_METRIC = {
  PAGE_ID: 1,
  SCRIPT: {
    id: 'threat_metric_script',
    src: 'https://h.online-metrix.net/fp/tags.js',
  },
  IFRAME: {
    id: 'threat_metric_iframe',
    src: ' https://us.ovhcloud.com/order/threatmetrix',
  },
};

export const VANTIV_IFRAME_CONFIGURATION = {
  paypageId: 'ThwL3YY9YEnWXTFb',
  style: 'ovhcss',
  height: '75px',
  reportGroup: 'ovh.us',
  timeout: 15000,
  div: 'eProtectIframe',

  // Expiration date
  months: {
    1: '01',
    2: '02',
    3: '03',
    4: '04',
    5: '05',
    6: '06',
    7: '07',
    8: '08',
    9: '09',
    10: '10',
    11: '11',
    12: '12',
  },
  numYears: 11,

  // Helpers
  tooltipText: 'A CVV is the 3 digit code on the back of your Visa, MasterCard and Discover or a 4 digit code on the front of your American Express',
  placeholderText: {
    cvv: 'CVV',
    accountNumber: 'Account Number',
  },

  // Behaviour
  showCvv: true,
  tabIndex: {
    cvv: 1,
    accountNumber: 2,
    expMonth: 3,
    expYear: 4,
  },
  enhancedUxFeatures: {
    inlineFieldValidations: true,
  },
};

export const VANTIV_RESPONSE_CODE = {
  SUCCESS: 870,
  ACCOUNT_NUMBER_NOT_MOD_10: 871,
  ACCOUNT_NUMBER_TOO_SHORT: 872,
  ACCOUNT_NUMBER_TOO_LONG: 873,
  ACCOUNT_NUMBER_NOT_NUMERIC: 874,
  UNABLE_TO_ENCRYPT_FIELD: 875,
  ACCOUNT_NUMBER_INVALID: 876,
  CARD_VALIDATION_NUMBER_NOT_NUMERIC: 881,
  CARD_VALIDATION_NUMBER_TOO_SHORT: 882,
  CARD_VALIDATION_NUMBER_TOO_LONG: 883,
  EPROTECT_IFRAME_HTML_FAILED_TO_LOAD: 884,
  EPROTECT_IFRAME_CSS_FAILED_TO_LOAD: 885,
  FAILURE: 889,
};

export const VANTIV_SCRIPT = {
  id: 'vantiv_script',
  src: 'https://request.eprotect.vantivcnp.com/eProtect/js/eProtect-iframe-client.min.js',
};

export default {
  THREAT_METRIC,
  VANTIV_IFRAME_CONFIGURATION,
  VANTIV_RESPONSE_CODE,
  VANTIV_SCRIPT,
};
