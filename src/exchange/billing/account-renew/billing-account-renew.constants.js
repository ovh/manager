const RENEW_PERIODS = [
  'YEARLY',
  'MONTHLY',
  'DELETE_AT_EXPIRATION',
];

angular.module('Module.exchange')
  .constant('EXCHANGE_RENEW_PERIODS', RENEW_PERIODS);
