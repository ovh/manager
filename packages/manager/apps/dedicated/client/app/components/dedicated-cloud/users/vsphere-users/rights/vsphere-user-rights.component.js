import controller from './vsphere-user-rights.controller';
import template from './vsphere-user-rights.html';

export default {
  bindings: {
    editRight: '<',
    goBack: '<',
    pccType: '<',
    productId: '<',
    userId: '<',
  },
  controller,
  template,
};
