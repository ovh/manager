export default class BillingPaymentCtrl {
  /* @ngInject */

  constructor(
    $state,
    coreConfig,
    voucherAccounts,
    fidelityPoints,
    guides,
    trackClick,
  ) {
    // dependencies injections
    this.$state = $state;
    this.coreConfig = coreConfig;
    this.voucherAccounts = voucherAccounts;
    this.fidelityPoints = fidelityPoints;
    this.guides = guides;
    this.trackClick = trackClick;
  }

  hasFidelityAccess() {
    return this.coreConfig.getRegion() === 'EU' && this.fidelityPoints > 0;
  }
}
