import controller from './vsphere-user-add.controller';
import template from './vsphere-user-add.html';

export default {
  bindings: {
    goBack: '<',
    passwordPolicy: '<',
    productId: '<',
  },
  controller,
  template,
};
