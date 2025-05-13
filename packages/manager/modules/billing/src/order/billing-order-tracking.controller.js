export default class BillingOrderTrackingCtrl {
  /* @ngInject */
  constructor($state, $stateParams, goToOrders) {
    this.$state = $state;
    this.orderId = $stateParams.orderId;
    this.goToOrders = goToOrders;
  }

  getBillingHistoryUrl() {
    return this.$state.href('app.account.billing.main.history');
  }
}
