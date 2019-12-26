angular.module('services').constant('BILLING_VANTIV', {
  SCRIPTS: {
    PRELIVE:
      'https://request.eprotect.vantivprelive.com/eProtect/js/eProtect-iframe-client.min.js',
    PROD:
      'https://request.eprotect.vantivcnp.com/eProtect/js/eProtect-iframe-client.min.js',
  },
  RESPONSES_CODE: {
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
  },
  CREDIT_CARD_ERRORS: [871, 872, 873, 874, 876],
  CARD_VALIDATION_NUMBER_ERRORS: [881, 882, 883],
});
