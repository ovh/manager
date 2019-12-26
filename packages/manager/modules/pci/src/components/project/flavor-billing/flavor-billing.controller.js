export default class FlavorBillingController {
  /* @ngInject */
  constructor(TranslateService) {
    this.TranslateService = TranslateService;
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
        this.TranslateService.getUserLocale().replace('_', '-'),
        { style: 'currency', currency: flavor.prices.hourly.currencyCode },
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
