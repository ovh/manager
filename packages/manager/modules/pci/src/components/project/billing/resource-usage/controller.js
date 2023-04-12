import { COLD_ARCHIVE_FEE_TYPES } from './constants';

export default class BillingResourceUsageCtrl {
  /* @ngInject */
  constructor(ovhManagerRegionService, $translate) {
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.$translate = $translate;
  }

  getType(type) {
    if (COLD_ARCHIVE_FEE_TYPES.includes(type)) {
      return this.$translate.instant(
        `pci_billing_private_registry_type_cold_archive_${type}_label`,
      );
    }
    return type;
  }

  static hourlyQuantity(quantity) {
    switch (quantity.unit) {
      case 'Minute':
        return (quantity.value / 60).toFixed(2);
      case 'Hour':
      default:
        return quantity.value;
    }
  }
}
