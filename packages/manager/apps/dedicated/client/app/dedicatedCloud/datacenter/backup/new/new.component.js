import controller from './new.controller';
import template from './new.html';

export default {
  bindings: {
    currentUser: '<',
    backupOffers: '<',
    datacenterId: '<',
    goToBackup: '<',
    productId: '<',
  },
  controller,
  template,
};
