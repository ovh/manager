import controller from './dedicatedCloud-user-enable.controller';
import template from './dedicatedCloud-user-enable.html';

export default {
  bindings: {
    goBack: '<',
    productId: '<',
    user: '<',
  },
  controller,
  template,
};
