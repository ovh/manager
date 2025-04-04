import { BETA } from '../../../constants';

export default class FlavorBillingController {
  /* @ngInject */
  constructor(coreConfig) {
    this.coreConfig = coreConfig;
    this.BETA = BETA;
  }

  $onInit() {
    this.monthly = this.monthlyBilling === true;
    this.number = this.number || 1;
    this.disabled = this.disabled || false;
    this.defaultGateway = this.addons?.find((addon) => addon.gateway);
    this.defaultFloatingIP = this.addons?.find((addon) => addon.floatingIp);
  }

  set flavor(flavor) {
    if (flavor) {
      this.tagsBlob = flavor?.tagsBlob;
      this.prices = flavor.prices;
      this.PriceFormatter = new Intl.NumberFormat(
        this.coreConfig.getUserLocale().replace('_', '-'),
        {
          style: 'currency',
          ...(flavor.prices?.hourly?.currencyCode && {
            currency: flavor.prices.hourly.currencyCode,
          }),
          maximumFractionDigits: 5, // default is 2. But this rounds off the price
        },
      );
    }
  }

  selectBilling(monthlyBilling) {
    this.monthlyBilling = monthlyBilling;
    this.onChange({ billing: monthlyBilling });
  }

  isPricingComingSoon() {
    return !this.prices?.monthly;
  }

  getPrice(price) {
    return this.number * ('value' in price ? price.value : price);
  }

  formatPrice(price) {
    return this.PriceFormatter.format(this.getPrice(price));
  }

  formatAddonsPrice = (price = 0) => price / 100000000;

  getAddOnPriceMonthly() {
    if (this.addons) {
      return (
        (this.prices?.monthly?.value || 0) +
        this.formatAddonsPrice(this.defaultGateway?.gateway.pricePerMonth) +
        this.formatAddonsPrice(this.defaultFloatingIP?.floatingIp.pricePerMonth)
      );
    }
    return null;
  }

  getAddOnPriceHourly() {
    if (this.addons) {
      return (
        (this.prices?.hourly?.value || 0) +
        this.formatAddonsPrice(this.defaultGateway?.gateway.pricePerHour) +
        this.formatAddonsPrice(this.defaultFloatingIP?.floatingIp.pricePerHour)
      );
    }
    return null;
  }
}
