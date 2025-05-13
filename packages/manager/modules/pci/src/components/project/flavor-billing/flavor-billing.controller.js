import { BETA } from '../../../constants';

export default class FlavorBillingController {
  /* @ngInject */
  constructor(coreConfig, PciProjectsProjectInstanceService, $scope) {
    this.coreConfig = coreConfig;
    this.PciProjectsProjectInstanceService = PciProjectsProjectInstanceService;
    this.$scope = $scope;
    this.BETA = BETA;

    $scope.$watch(
      () => this.flavor,
      () => {
        if (this.flavor) {
          this.tagsBlob = this.flavor?.tagsBlob;
          this.prices = this.flavor.prices;
          this.PriceFormatter = new Intl.NumberFormat(
            this.coreConfig.getUserLocale().replace('_', '-'),
            {
              style: 'currency',
              ...(this.flavor.prices?.hourly?.currencyCode && {
                currency: this.flavor.prices.hourly.currencyCode,
              }),
              maximumFractionDigits: 5, // default is 2. But this rounds off the price
            },
          );
        }
      },
    );
  }

  $onInit() {
    this.monthly = this.monthlyBilling === true;
    this.number = this.number || 1;
    this.disabled = this.disabled || false;
    this.defaultGateway = this.addons?.find((addon) => addon.gateway);
    this.defaultFloatingIP = this.addons?.find((addon) => addon.floatingIp);

    this.licensePrice = null;
    this.PciProjectsProjectInstanceService.getCatalog(
      '/order/catalog/public/cloud',
      this.coreConfig.getUser(),
    ).then((catalog) => {
      this.catalog = catalog;

      this.computeLicensePrice(this.flavor, this.number);
      this.$scope.$watch(
        () => this.flavor,
        () => this.computeLicensePrice(this.flavor, this.number),
      );
      this.$scope.$watch(
        () => this.number,
        () => this.computeLicensePrice(this.flavor, this.number),
      );
    });
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

  computeLicensePrice(flavor, modelNumber) {
    if (flavor && modelNumber) {
      const price = this.PciProjectsProjectInstanceService.getLicensePrice(
        this.catalog,
        flavor,
      );

      this.licensePrice =
        price !== null
          ? this.PciProjectsProjectInstanceService.formatLicensePrice(
              price * flavor.technicalBlob.cpu.cores * modelNumber,
            )
          : null;
    }
  }
}
