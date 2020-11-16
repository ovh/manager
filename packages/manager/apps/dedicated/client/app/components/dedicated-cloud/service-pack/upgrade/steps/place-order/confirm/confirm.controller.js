export default class {
  /* @ngInject */
  constructor(
    $translate,
    $uibModalInstance,
    hasDefaultMeansOfPayment,
    itemName,
    itemType,
    prices,
  ) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.hasDefaultMeansOfPayment = hasDefaultMeansOfPayment;
    this.itemName = itemName;
    this.itemType = itemType;
    this.prices = prices;
  }

  $onInit() {
    this.addingOrDeducting =
      (this.prices.hourly.exists && this.prices.hourly.value > 0) ||
      (this.prices.monthly.exists && this.prices.monthly.value > 0)
        ? 'adding'
        : 'deducting';

    this.hourly =
      this.prices.hourly.exists && this.prices.hourly.display.substr(1);

    this.monthly =
      this.prices.monthly.exists && this.prices.monthly.display.substr(1);
  }
}
