export default class BillingPaymentCtrl {
  /* @ngInject */

  constructor($state, coreConfig, voucherAccounts) {
    // dependencies injections
    this.$state = $state;
    this.coreConfig = coreConfig;
    this.voucherAccounts = voucherAccounts;
  }
}
