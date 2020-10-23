export default class BillingPaymentCtrl {
  /* @ngInject */
  constructor($state, coreConfig) {
    // dependencies injections
    this.$state = $state;
    this.coreConfig = coreConfig;
  }
}
