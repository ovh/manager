import controller from './backup.controller';
import template from './backup.html';

export default {
  bindings: {
    backup: '<',
    backupOffers: '<',
    backupOffersUnderProcess: '<',
    currentUser: '<',
    datacenterId: '<',
    goToUpgradeOffer: '<',
    operationsUrl: '<',
    productId: '<',
    scrollToTop: '<',
    goToDeleteBackup: '<',
    guideUrl: '<',
  },
  controller,
  template,
};
