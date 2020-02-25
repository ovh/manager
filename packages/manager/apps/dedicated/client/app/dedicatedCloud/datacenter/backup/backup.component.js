import controller from './backup.controller';
import template from './backup.html';

export default {
  bindings: {
    backupOffers: '<',
    currentUser: '<',
    datacenterId: '<',
    productId: '<',
    backup: '<',
  },
  controller,
  template,
};
