import { pricingConstants } from '@ovh-ux/manager-product-offers';
import { MEMORY_MULTIPLE, MIGRATE_FAQ_LINK } from './migrate.constants';

export default class {
  /* @ngInject */
  constructor(
    atInternet,
    coreConfig,
    ovhManagerProductOffersService,
    VpsHelperService,
  ) {
    this.atInternet = atInternet;
    this.coreConfig = coreConfig;
    this.ovhManagerProductOffersService = ovhManagerProductOffersService;
    this.VpsHelperService = VpsHelperService;
    this.MEMORY_MULTIPLE = MEMORY_MULTIPLE;
  }

  $onInit() {
    this.MIGRATE_FAQ_LINK =
      MIGRATE_FAQ_LINK[this.user.ovhSubsidiary] || MIGRATE_FAQ_LINK.DEFAULT;
    this.newPlans = this.newPlans.map((newPlan) => ({
      ...newPlan,
      configuration: this.VpsHelperService.parseRangeConfiguration(
        newPlan.planCode,
      ),
    }));
  }

  cancel() {
    this.atInternet.trackClick({
      name: `${this.migrationTrackingPrefix}::cancel`,
      type: 'action',
    });
    return this.goBack();
  }

  getCurrentPrice() {
    return this.ovhManagerProductOffersService.constructor.getUniquePricingOfCapacity(
      this.currentPrice,
      pricingConstants.PRICING_CAPACITIES.RENEW,
    ).price;
  }

  formatMemory(memory) {
    return memory / this.MEMORY_MULTIPLE;
  }

  getStorageCapacity = (newPlan) => {
    return newPlan.configuration?.storage?.disks[0]?.capacity || 0;
  };

  getOriginalPriceWithoutTax = (planCode, newPrices) => {
    return newPrices.find((price) => price.newPlan === planCode).price?.prices
      ?.originalWithoutTax.text;
  };

  getPlanLabel = (planDetails) => {
    const [, planCode = ''] = planDetails.planCode.split('-');
    return `${planCode.charAt(0).toUpperCase()}${planCode.slice(1)}`;
  };
}
