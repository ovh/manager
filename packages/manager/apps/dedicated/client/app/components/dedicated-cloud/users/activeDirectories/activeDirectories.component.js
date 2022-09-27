import controller from './activeDirectories.controller';
import template from './activeDirectories.html';

export default {
  bindings: {
    dedicatedCloud: '<',
    productId: '<',
    goToAddFederation: '<',
  },
  controller,
  template,
};
