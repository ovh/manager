import controller from './vsphere-user-disable.controller';
import template from './vsphere-user-disable.html';

export default {
  bindings: {
    goBack: '<',
    productId: '<',
    user: '<',
  },
  controller,
  template,
};
