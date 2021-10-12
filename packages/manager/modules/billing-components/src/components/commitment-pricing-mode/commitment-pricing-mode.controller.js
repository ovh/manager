export default class {
  /* @ngInject */
  constructor($attrs, BillingService, coreConfig) {
    this.$attrs = $attrs;
    this.BillingService = BillingService;
    this.coreConfig = coreConfig;
  }

  getDiscount() {
    const upfront = this.pricingModes.find((commitment) =>
      commitment.isUpfront(),
    );
    const periodic = this.pricingModes.find((commitment) =>
      commitment.isPeriodic(),
    );

    if (upfront && periodic) {
      this.discount = Math.floor(
        (periodic.totalPrice.value / upfront.totalPrice.value - 1) * 100,
      );
      return periodic.getPriceDiff(upfront);
    }

    return {};
  }
}
