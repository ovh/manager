import template from './domain-webhosting-order.html';

export default {
  bindings: {
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

    displayErrorMessage: '<',
  },
  name: 'ovhManagerWebDomainWebhostingOrder',
  template,
};
