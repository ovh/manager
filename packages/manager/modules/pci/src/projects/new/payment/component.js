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
    getPaymentMethod: '<',
    eligibility: '<',
    model: '<',
    defaultPaymentMethod: '<',
    hasComponentRedirectCallback: '<',
    validPaymentMethods: '<',
    onCartFinalized: '<',
    onAskCreditPayment: '<',
    globalLoading: '<',
    paymentStatus: '<',
    trackPage: '<',
    sendTrack: '<',
  },
};
