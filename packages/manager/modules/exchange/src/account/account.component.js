import controller from './account.controller';
import template from './account.html';

export default {
  bindings: {
    goToAddAccount: '<',
    goToAliasManagement: '<',
    organization: '<',
    productId: '<',
  },
  controller,
  template,
};
