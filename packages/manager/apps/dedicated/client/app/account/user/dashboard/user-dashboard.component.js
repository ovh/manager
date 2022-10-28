import template from './user-dashboard.html';

export default {
  bindings: {
    lastBill: '<',
    shortcuts: '<',
    supportLevel: '<',
    user: '<',
    authMethodProvider: '<',
  },
  template,
};
