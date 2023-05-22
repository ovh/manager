import template from './domain-webhosting-order.html';

export default {
  bindings: {
    catalog: '<',
    getAvailableModules: '<',
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
