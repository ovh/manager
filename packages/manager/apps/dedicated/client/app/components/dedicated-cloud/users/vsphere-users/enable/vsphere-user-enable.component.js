import controller from './vsphere-user-enable.controller';
import template from './vsphere-user-enable.html';

export default {
  bindings: {
    goBack: '<',
    productId: '<',
    user: '<',
  },
  controller,
  template,
};
