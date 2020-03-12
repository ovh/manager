import controller from './new.controller';
import template from './new.html';

export default {
  bindings: {
    backup: '<',
    backupOffers: '<',
    backupOffersUnderProcess: '<',
    backupTariffUrl: '@',
    currentUser: '<',
    datacenterId: '<',
    enabledBackupOffer: '<',
    goToBackup: '<',
    productId: '<',
    operationsUrl: '<',
    scrollToTop: '<',
  },
  controller,
  template,
};
