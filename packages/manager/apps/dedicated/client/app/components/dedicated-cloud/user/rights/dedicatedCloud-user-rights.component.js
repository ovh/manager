import controller from './dedicatedCloud-user-rights.controller';
import template from './dedicatedCloud-user-rights.html';

export default {
  bindings: {
    editRight: '<',
    goBack: '<',
    productId: '<',
    userId: '<',
  },
  controller,
  template,
};
