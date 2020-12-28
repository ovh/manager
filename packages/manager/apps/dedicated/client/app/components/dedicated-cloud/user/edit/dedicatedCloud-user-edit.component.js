import controller from './dedicatedCloud-user-edit.controller';
import template from './dedicatedCloud-user-edit.html';

export default {
  bindings: {
    goBack: '<',
    optionsAvailable: '<',
    productId: '<',
    user: '<',
  },
  controller,
  template,
};
