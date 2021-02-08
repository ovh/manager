import controller from './controller';
import template from './index.html';

export default {
  name: 'pciProjectNewPayment',
  controller,
  template,
  bindings: {
    callback: '<',
    cart: '<',
    reloadPayment: '<',
    getCancelHref: '<',
    eligibility: '<',
    model: '<',
    defaultPaymentMethod: '<',
    hasComponentRedirectCallback: '<',
    validPaymentMethods: '<',
    onCartFinalized: '<',
    onAskCreditPayment: '<',
    globalLoading: '<',
    paymentStatus: '<',
  },
};
