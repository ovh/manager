import controller from './renew.controller';
import template from './renew.html';

export default {
  bindings: {
    exchange: '<',
    getAccounts: '<',
    goBack: '<',
    updateRenew: '<',
  },
  controller,
  template,
};
