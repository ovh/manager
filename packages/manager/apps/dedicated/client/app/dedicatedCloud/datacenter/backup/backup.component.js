import controller from './backup.controller';
import template from './backup.html';

export default {
  bindings: {
    backup: '<',
    backupOffers: '<',
    currentUser: '<',
    datacenterId: '<',
    goToUpgradeOffer: '<',
    operationsUrl: '<',
    productId: '<',
    scrollToTop: '<',
    goToDeleteBackup: '<',
  },
  controller,
  template,
};
