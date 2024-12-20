import { convertLanguageFromOVHToBCP47 } from '@ovh-ux/manager-config';

export default class CommitmentPricingModeCtrl {
  /* @ngInject */
  constructor($attrs, BillingService, coreConfig) {
    this.$attrs = $attrs;
    this.BillingService = BillingService;
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.computeDiscount();
  }

  static roundToTwo(num) {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed
    return Number.parseFloat(num).toFixed(2);
  }

  hasSavings() {
    const { savings } = this.duration;

    return this.defaultPrice && savings?.value > 0;
  }

  computeDiscount() {
    const upfront = this.pricingModes.find((commitment) =>
      commitment.isUpfront(),
    );
    const periodic = this.pricingModes.find((commitment) =>
      commitment.isPeriodic(),
    );

    if (upfront && periodic) {
      // compute discount
      const { value: savedAmount } = periodic.getPriceDiff(
        upfront,
        this.selectedQuantity,
      );
      this.discount = CommitmentPricingModeCtrl.roundToTwo(
        (savedAmount / periodic.totalPrice.value) * 100,
      );

      // compute total saving
      const { savings } = this.duration;
      const totalSavings = savedAmount + (savings?.value || 0);

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
        // use symbol instead of narrowSymbol to support Safari < 14.1
        currencyDisplay: 'symbol',
      },
    ).format(price);
  }
}
