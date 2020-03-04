import template from './dashboard.html';

export default {
  bindings: {
    bills: '<',
    feedbackUrl: '<',
    me: '<',
    billingServices: '<',
    notifications: '<',
    order: '<',
    services: '<',
    trackingPrefix: '<',
  },
  template,
};
