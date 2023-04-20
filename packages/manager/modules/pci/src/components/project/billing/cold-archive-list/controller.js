import { COLD_ARCHIVE_GRID_DATA } from '../../../../projects/project/billing/legacy/billing-legacy.constant';

export default class BillingColdArchiveListCtrl {
  /* @ngInject */
  constructor(ovhManagerRegionService, $translate) {
    this.ovhManagerRegionService = ovhManagerRegionService;
    this.$translate = $translate;
    this.COLD_ARCHIVE_GRID_DATA = COLD_ARCHIVE_GRID_DATA;
  }

  getType(type) {
    return this.$translate.instant(
      `pci_billing_cold_archive_type_${type}_label`,
    );
  }

  quantityUnit(quantity) {
    if (quantity.unit === this.COLD_ARCHIVE_GRID_DATA.QUANTITY.HOUR) {
      return this.$translate.instant(
        'pci_billing_cold_archive_consumption_value_gbih',
        { value: quantity.value },
      );
    }

    return this.$translate.instant(
      'pci_billing_cold_archive_consumption_value_gbi',
      { value: quantity.value },
    );
  }

  getFeeTypeTooltipMessage(type) {
    if (type === this.COLD_ARCHIVE_GRID_DATA.FEE_TYPES['ARCHIVE-FEES']) {
      return (
        this.$translate.instant(
          'pci_billing_cold_archive_type_archive-fees_tooltip_1',
        ) +
        this.$translate.instant(
          'pci_billing_cold_archive_type_archive-fees_tooltip_2',
        )
      );
    }
    return '';
  }
}
