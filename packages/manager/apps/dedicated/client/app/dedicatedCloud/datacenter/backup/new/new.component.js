import controller from './new.controller';
import template from './new.html';

export default {
  bindings: {
    backup: '<',
    backupOffers: '<',
    backupTariffUrl: '@',
    currentUser: '<',
    datacenterId: '<',
    goToBackup: '<',
    productId: '<',
    scrollToTop: '<',
  },
  controller,
  template,
};
