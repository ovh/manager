import controller from './dedicatedCloud-user-rights-edit.controller';
import template from './dedicatedCloud-user-rights-edit.html';

export default {
  bindings: {
    goBack: '<',
    productId: '<',
    rightId: '<',
    user: '<',
  },
  controller,
  template,
};
