export default class FlavorBillingController {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
  }

  $onInit() {
    this.monthly = this.monthlyBilling === true;
    this.number = this.number || 1;
    this.disabled = this.disabled || false;
    this.defaultGateway = this.addons?.find((addon) =>
      addon.product?.startsWith('publiccloud-gateway'),
    );
    this.defaultFloatingIP = this.addons?.find((addon) =>
      addon.product?.startsWith('publiccloud-floatingip'),
    );
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
    return this.number * (price.value || price);
  }

  formatPrice(price) {
    return this.PriceFormatter.format(this.getPrice(price));
  }

  formatAddonsPrice = (price = 0) => price / 100000000;

  getAddOnPrice() {
    if (this.addons) {
      return (
        this.prices.monthly.value +
        this.formatAddonsPrice(this.defaultGateway?.pricings[0]?.price) +
        this.formatAddonsPrice(this.defaultFloatingIP?.pricings[0]?.price)
      );
    }
    return null;
  }
}
