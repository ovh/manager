import controller from './backup.controller';
import template from './backup.html';

export default {
  bindings: {
    backup: '<',
    backupOffers: '<',
    currentUser: '<',
    datacenterId: '<',
    messageToShow: '<',
    productId: '<',
    scrollToTop: '<',
  },
  controller,
  template,
};
