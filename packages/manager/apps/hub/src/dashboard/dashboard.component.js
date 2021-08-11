import controller from './dashboard.controller';
import template from './dashboard.html';

export default {
  bindings: {
    bills: '<',
    debt: '<',
    me: '<',
    billingServices: '<',
    expand: '<',
    expandProducts: '<',
    goToProductPage: '<',
    notifications: '<',
    order: '<',
    products: '<',
    refresh: '<',
    refreshBillingServices: '<',
    refreshOrder: '<',
    services: '<',
    tickets: '<',
    trackingPrefix: '<',
  },
  controller,
  template,
};
