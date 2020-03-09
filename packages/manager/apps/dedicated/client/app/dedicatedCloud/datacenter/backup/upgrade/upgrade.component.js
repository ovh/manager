import controller from './upgrade.controller';
import template from './template.html';

export default {
  bindings: {
    actualOffer: '<',
    backup: '<',
    backupOffers: '<',
    backupTariffUrl: '<',
    currentUser: '<',
    datacenterId: '<',
    goToBackup: '<',
    productId: '<',
  },
  controller,
  template,
};
