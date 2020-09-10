import controller from './dedicatedCloud-user-delete.controller';
import template from './dedicatedCloud-user-delete.html';

export default {
  bindings: {
    goBack: '<',
    productId: '<',
    user: '<',
  },
  controller,
  template,
};
