import controller from './domain-webhosting-order-steps.controller';
import template from './domain-webhosting-order-steps.html';

export default {
  bindings: {
    alertCheckoutError: '<',
    availableModules: '<',
    availableOffers: '<',
    cartId: '<',
    defaultPaymentMean: '<',
    deleteCartItems: '<',
    domainName: '<',
    goBackToDashboard: '<',
    prepareCheckout: '<',
    user: '<',
    validateCheckout: '<',
  },
  controller,
  name: 'ovhManagerWebDomainWebhostingOrderSteps',
  template,
};
