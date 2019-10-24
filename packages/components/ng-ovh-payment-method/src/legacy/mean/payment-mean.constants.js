export const AVAILABLE_PAYMENT_MEANS = {
  EU: [{
    value: 'bankAccount',
    registerable: true,
  }, {
    value: 'paypal',
    registerable: true,
  }, {
    value: 'creditCard',
    registerable: true,
  }, {
    value: 'deferredPaymentAccount',
    registerable: false,
  }],
  CA: [{
    value: 'paypal',
    registerable: true,
  }, {
    value: 'creditCard',
    registerable: true,
  }, {
    value: 'deferredPaymentAccount',
    registerable: false,
  }],
};

export const PAYMENT_MEAN_STATUS_ENUM = {
  BLOCKED_FOR_INCIDENTS: 'BLOCKED_FOR_INCIDENTS',
  PENDING_VALIDATION: 'PENDING_VALIDATION',
  VALID: 'VALID',
  EXPIRED: 'EXPIRED',
  TOO_MANY_FAILURES: 'TOO_MANY_FAILURES',
};

export const PAYMENT_MEAN_TYPE_ENUM = {
  BANK_ACCOUNT: 'bankAccount',
  CREDIT_CARD: 'creditCard',
  DEFERRED_PAYMENT_ACCOUNT: 'deferredPaymentAccount',
  PAYPAL: 'paypal',
};

export default {
  AVAILABLE_PAYMENT_MEANS,
  PAYMENT_MEAN_STATUS_ENUM,
  PAYMENT_MEAN_TYPE_ENUM,
};
