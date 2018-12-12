export const AVAILABLE_PAYMENT_MEANS = [{
  value: 'bankAccount',
  canBeAdded: true,
}, {
  value: 'paypal',
  canBeAdded: true,
}, {
  value: 'creditCard',
  canBeAdded: true,
}, {
  value: 'deferredPaymentAccount',
  canBeAdded: false,
}];

export default {
  AVAILABLE_PAYMENT_MEANS,
};
