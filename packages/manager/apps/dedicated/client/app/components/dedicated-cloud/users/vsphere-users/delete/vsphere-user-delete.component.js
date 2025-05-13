import controller from './vsphere-user-delete.controller';
import template from './vsphere-user-delete.html';

export default {
  bindings: {
    goBack: '<',
    productId: '<',
    user: '<',
  },
  controller,
  template,
};
