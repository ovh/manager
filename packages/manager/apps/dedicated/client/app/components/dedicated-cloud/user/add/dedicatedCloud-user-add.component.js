import controller from './dedicatedCloud-user-add.controller';
import template from './dedicatedCloud-user-add.html';

export default {
  bindings: {
    goBack: '<',
    passwordPolicy: '<',
    productId: '<',
  },
  controller,
  template,
};
