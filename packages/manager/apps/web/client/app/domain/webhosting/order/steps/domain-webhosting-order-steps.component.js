import controller from './domain-webhosting-order-steps.controller';
import template from './domain-webhosting-order-steps.html';

export default {
  bindings: {
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

    displayErrorMessage: '<',
  },
  controller,
  name: 'ovhManagerWebDomainWebhostingOrderSteps',
  template,
};
