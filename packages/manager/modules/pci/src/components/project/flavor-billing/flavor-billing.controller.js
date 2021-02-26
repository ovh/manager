export default class FlavorBillingController {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.monthly = this.monthlyBilling === true;
    this.number = this.number || 1;

    this.disabled = this.disabled || false;
  }

  set flavor(flavor) {
    if (flavor) {
      this.prices = flavor.prices;
      this.PriceFormatter = new Intl.NumberFormat(
        this.coreConfig.getUserLocale().replace('_', '-'),
        {
          style: 'currency',
          currency: flavor.prices.hourly.currencyCode,
          maximumFractionDigits: 5, // default is 2. But this rounds off the price
        },
      );
    }
  }

  selectBilling(monthlyBilling) {
    this.monthlyBilling = monthlyBilling;
  }

  getPrice(price) {
    return this.number * price.value;
  }

  formatPrice(price) {
    return this.PriceFormatter.format(this.getPrice(price));
  }
}
