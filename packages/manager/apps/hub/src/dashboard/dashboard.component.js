import template from './dashboard.html';

export default {
  bindings: {
    bills: '<',
    me: '<',
    billingServices: '<',
    notifications: '<',
    order: '<',
    services: '<',
    trackingPrefix: '<',
  },
  template,
};
