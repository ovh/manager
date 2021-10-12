import { convertLanguageFromOVHToBCP47 } from '@ovh-ux/manager-config';

export default class {
  /* @ngInject */
  constructor($attrs, BillingService, coreConfig) {
    this.$attrs = $attrs;
    this.BillingService = BillingService;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.getDiscount();
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
      this.savings = periodic.getPriceDiff(upfront);
      let totalSavings = this.savings.value;
      totalSavings += this.duration.savings ? this.duration.savings.value : 0;
      this.upfrontSavings = {
        amountSaved: this.getPriceAsText(
          totalSavings,
          upfront.pricing.price.currencyCode,
        ),
        amountToPay: upfront.totalPrice.text,
      };
    }
  }

  getPriceAsText(price, currencyCode) {
    return Intl.NumberFormat(
      convertLanguageFromOVHToBCP47(this.coreConfig.getUserLocale()),
      {
        style: 'currency',
        currency: currencyCode,
        currencyDisplay: 'narrowSymbol',
      },
    ).format(price);
  }
}
