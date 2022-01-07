export default class {
  /* @ngInject */
  constructor(
    $translate,
    $uibModalInstance,
    atInternet,
    hasDefaultMeansOfPayment,
    itemName,
    itemType,
    prices,
    itemRef,
  ) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.atInternet = atInternet;
    this.hasDefaultMeansOfPayment = hasDefaultMeansOfPayment;
    this.itemName = itemName;
    this.itemType = itemType;
    this.itemRef = itemRef;
    this.prices = prices;
  }

  $onInit() {
    if (
      (this.prices.hourly.exists && this.prices.hourly.value === 0) ||
      (this.prices.monthly.exists && this.prices.monthly.value === 0)
    ) {
      this.addingOrDeducting = 'same';
    } else {
      this.addingOrDeducting =
        (this.prices.hourly.exists && this.prices.hourly.value > 0) ||
        (this.prices.monthly.exists && this.prices.monthly.value > 0)
          ? 'adding'
          : 'deducting';
    }

    this.hourly =
      this.prices.hourly.exists && this.prices.hourly.display.substr(1);

    this.monthly =
      this.prices.monthly.exists && this.prices.monthly.display.substr(1);
  }

  onValide() {
    this.atInternet.trackClick({
      name: `dedicated::dedicatedCloud::details::servicePackUpgrade::basicOptions::confirm_${this.itemRef}`,
      type: 'action',
    });
    this.$uibModalInstance.close();
  }

  onCancel() {
    this.atInternet.trackClick({
      name:
        'dedicated::dedicatedCloud::details::servicePackUpgrade::basicOptions::cancel',
      type: 'action',
    });
    this.$uibModalInstance.dismiss();
  }
}
