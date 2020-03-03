import controller from './upgrade.controller';
import template from './template.html';

export default {
  bindings: {
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
