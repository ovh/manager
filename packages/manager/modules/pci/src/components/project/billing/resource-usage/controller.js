export default class BillingResourceUsageCtrl {
  /* @ngInject */
  constructor(ovhManagerRegionService) {
    this.ovhManagerRegionService = ovhManagerRegionService;
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
