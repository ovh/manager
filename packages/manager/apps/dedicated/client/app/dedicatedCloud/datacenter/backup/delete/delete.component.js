import controller from './delete.controller';
import template from './delete.html';

export default {
  bindings: {
    datacenterId: '<',
    productId: '<',
    backup: '<',
    goToBackup: '<',
  },
  controller,
  template,
};
