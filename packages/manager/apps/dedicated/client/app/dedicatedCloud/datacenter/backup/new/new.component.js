import controller from './new.controller';
import template from './new.html';

export default {
  bindings: {
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
