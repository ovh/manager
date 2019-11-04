import template from './domain-webhosting-order.html';

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
    orderWebhosting: '<',
    prepareCheckout: '<',
    renewDate: '<',
    user: '<',
    validateCheckout: '<',
  },
  name: 'ovhManagerWebDomainWebhostingOrder',
  template,
};
