import controller from './vsphere-user-rights-edit.controller';
import template from './vsphere-user-rights-edit.html';

export default {
  bindings: {
    goBack: '<',
    pccType: '<',
    productId: '<',
    rightId: '<',
    user: '<',
  },
  controller,
  template,
};
