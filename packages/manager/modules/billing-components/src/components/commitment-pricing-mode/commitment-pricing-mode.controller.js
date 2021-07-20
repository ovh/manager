export default class {
  /* @ngInject */
  constructor($attrs, BillingService, coreConfig) {
    this.$attrs = $attrs;
    this.BillingService = BillingService;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.fromCatalog = this.fromCatalog || this.$attrs.fromCatalog === '';
    this.modes = this.fromCatalog
      ? this.BillingService.getAvailableEngagementFromCatalog(this.pricingModes)
      : this.pricingModes;

    this.getDiscount();
  }

  getDiscount() {
    const upfront = this.modes.find((commitment) => commitment.isUpfront());
    const periodic = this.modes.find((commitment) => commitment.isPeriodic());

    if (upfront && periodic) {
      this.discount = Math.floor(
        (periodic.totalPrice.value / upfront.totalPrice.value - 1) * 100,
      );
      this.savings = periodic.getPriceDiff(upfront);
    }
  }
}
