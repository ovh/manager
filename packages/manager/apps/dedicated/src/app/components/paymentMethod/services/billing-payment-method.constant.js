angular.module('services').constant('BILLING_PAYMENT_METHOD', {
  EXCLUDED_AUTOMATIC_TYPES_FOR_CREATION: ['deferredPaymentAccount'],
  CREDIT_CARD: {
    YEARS_NUMBER: 20,
  },
  UPDATE_POLL: {
    INTERVAL: 5 * 1000,
    TIMEOUT: 5 * 60 * 1000,
  },
});
