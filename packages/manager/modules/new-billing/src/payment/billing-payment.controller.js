export default class BillingPaymentCtrl {
  /* @ngInject */

  constructor($state, coreConfig, voucherAccounts, guides, trackClick) {
    // dependencies injections
    this.$state = $state;
    this.coreConfig = coreConfig;
    this.voucherAccounts = voucherAccounts;
    this.guides = guides;
    this.trackClick = trackClick;
  }
}
