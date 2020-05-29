import controller from './controller';
import template from './index.html';

export default {
  name: 'pciProjectNewPayment',
  controller,
  template,
  bindings: {
    cart: '<',
    reloadPayment: '<',
    getCancelHref: '<',
    eligibility: '<',
    model: '<',
    defaultPaymentMethod: '<',
    validPaymentMethods: '<',
    onCartFinalized: '<',
    onAskCreditPayment: '<',
    globalLoading: '<',
    paymentStatus: '<',
  },
};
