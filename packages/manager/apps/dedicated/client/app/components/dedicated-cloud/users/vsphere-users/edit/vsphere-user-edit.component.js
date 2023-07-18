import controller from './vsphere-user-edit.controller';
import template from './vsphere-user-edit.html';

export default {
  bindings: {
    goBack: '<',
    optionsAvailable: '<',
    hasNsxOption: '<',
    productId: '<',
    user: '<',
  },
  controller,
  template,
};
