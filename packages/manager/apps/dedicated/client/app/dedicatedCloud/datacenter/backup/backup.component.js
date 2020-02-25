import controller from './backup.controller';
import template from './backup.html';

export default {
  bindings: {
    backupOffers: '<',
    datacenterId: '<',
    productId: '<',
  },
  controller,
  template,
};
