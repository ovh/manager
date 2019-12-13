import template from './domain-webhosting-order.html';

export default {
  bindings: {
    availableModules: '<',
    availableOffers: '<',
    cartId: '<',
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
