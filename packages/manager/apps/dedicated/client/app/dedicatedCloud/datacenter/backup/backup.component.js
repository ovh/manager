import controller from './backup.controller';
import template from './backup.html';

export default {
  bindings: {
    datacenterId: '<',
    backupOffers: '<',
    productId: '<',
  },
  controller,
  template,
};
