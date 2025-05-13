import controller from './shared-account.controller';
import template from './shared-account.html';

export default {
  bindings: {
    productId: '<',
    organization: '<',
    goToAliasManagement: '<',
  },
  controller,
  template,
};
