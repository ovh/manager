import controller from './vsphere-user-password-reset.controller';
import template from './vsphere-user-password-reset.html';

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
