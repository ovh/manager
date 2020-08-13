import controller from './account-alias.controller';
import template from './account-alias.html';

export default {
  controller,
  template,
  bindings: {
    account: '<',
    goToAccounts: '<',
  },
};
