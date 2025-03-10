import template from './domain-webhosting-order.html';
import controller from './domain-webhosting-order.controller';

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
    trackClick: '<',
  },
  name: 'ovhManagerWebDomainWebhostingOrder',
  template,
  controller,
};
