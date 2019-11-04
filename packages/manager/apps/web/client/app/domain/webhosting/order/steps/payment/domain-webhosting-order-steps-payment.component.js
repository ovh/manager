import controller from './domain-webhosting-order-steps-payment.controller';
import template from './domain-webhosting-order-steps-payment.html';

export default {
  bindings: {
    alertCheckoutError: '<',
    cartId: '<',
    defaultPaymentMean: '<',
    deleteCartItems: '<',
    domainName: '<',
    goBackToDashboard: '<',
    prepareCheckout: '<',
  },
  controller,
  name: 'ovhManagerWebDomainWebhostingOrderStepsPayment',
  require: {
    stepper: '^ovhManagerWebDomainWebhostingOrderSteps',
  },
  template,
};
