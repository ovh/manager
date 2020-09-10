import controller from './dedicatedCloud-user-edit.controller';
import template from './dedicatedCloud-user-edit.html';

export default {
  bindings: {
    goBack: '<',
    productId: '<',
    user: '<',
  },
  controller,
  template,
};
