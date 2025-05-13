import controller from './update-purchase-status.controller';
import template from './update-purchase-status.html';

export default {
  bindings: {
    goToPurchaseOrder: '<',
    purchase: '<',
    trackPage: '<',
  },
  controller,
  template,
};
