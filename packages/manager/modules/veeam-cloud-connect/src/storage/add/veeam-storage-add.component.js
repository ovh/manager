import controller from './veeam-storage-add.controller';
import template from './veeam-storage-add.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
    goToStorage: '<',
  },
};
