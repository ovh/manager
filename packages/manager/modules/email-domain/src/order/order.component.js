import controller from './email-domain-order.controller';
import template from './email-domain-order.html';

export default {
  bindings: {
    addConfiguration: '<',
    cart: '<',
    catalog: '<',
    deleteItem: '<',
    domain: '<',
    domains: '<',
    getCheckout: '<',
    order: '<',
    products: '<',
    user: '<',
  },
  controller,
  template,
};
