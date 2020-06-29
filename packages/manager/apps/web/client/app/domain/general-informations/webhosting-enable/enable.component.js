import controller from './domain-enable-web-hosting.controller';
import template from './domain-enable-web-hosting.html';

export default {
  bindings: {
    addOption: '<',
    defaultPaymentMethod: '<',
    domainName: '<',
    getCheckout: '<',
    goBack: '<',
    order: '<',
    start10mOffers: '<',
    user: '<',
  },
  controller,
  template,
};
