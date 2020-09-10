import controller from './dedicatedCloud-user-password-reset.controller';
import template from './dedicatedCloud-user-password-reset.html';

export default {
  bindings: {
    goBack: '<',
    passwordPolicy: '<',
    productId: '<',
    user: '<',
  },
  controller,
  template,
};
