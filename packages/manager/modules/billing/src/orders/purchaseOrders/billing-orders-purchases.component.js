import controller from './billing-orders-purchases.controller';
import template from './billing-orders-purchases.html';

export default {
  bindings: {
    criteria: '<',
    dateFormat: '<',
    disableDate: '<',
    filter: '<',
    goToEditPurchase: '<',
    goToNewPurchase: '<',
    goToModalDesactivatePurchase: '<',
    goToPurchaseOrder: '<',
    minDate: '<',
    minDateForEndDate: '<',
    purchases: '<',
    trackClick: '<',
    trackPage: '<',
    updateFilterParam: '<',
  },
  controller,
  template,
};
