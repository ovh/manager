import { pricingConstants } from '@ovh-ux/manager-product-offers';
import { MEMORY_MULTIPLE, MIGRATE_FAQ_LINK } from './migrate.constants';

export default class {
  /* @ngInject */
  constructor(atInternet, ovhManagerProductOffersService, VpsHelperService) {
    this.atInternet = atInternet;
    this.ovhManagerProductOffersService = ovhManagerProductOffersService;
    this.VpsHelperService = VpsHelperService;
    this.MEMORY_MULTIPLE = MEMORY_MULTIPLE;
  }

  $onInit() {
    this.MIGRATE_FAQ_LINK =
      MIGRATE_FAQ_LINK[this.user.ovhSubsidiary] || MIGRATE_FAQ_LINK.DEFAULT;
    this.newPlan = {
      ...this.newPlan,
      configuration: this.VpsHelperService.parseRangeConfiguration(
        this.newPlan.planCode,
      ),
    };
  }

  cancel() {
    this.atInternet.trackClick({
      name: `${this.migrationTrackingPrefix}::cancel`,
      type: 'action',
    });
    return this.goBack();
  }

  getRenewablePrice() {
    return this.ovhManagerProductOffersService.constructor.getUniquePricingOfCapacity(
      this.newPlan?.pricings,
      pricingConstants.PRICING_CAPACITIES.RENEW,
    ).price;
  }

  getStorageCapacity() {
    return this.newPlan.configuration?.storage?.disks[0]?.capacity || 0;
  }

  formatMemory(memory) {
    return memory / this.MEMORY_MULTIPLE;
  }
}
