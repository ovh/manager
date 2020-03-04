import controller from './delete.controller';
import template from './delete.html';

export default {
  bindings: {
    backup: '<',
    datacenterId: '<',
    goToBackup: '<',
    productId: '<',
  },
  controller,
  template,
};
