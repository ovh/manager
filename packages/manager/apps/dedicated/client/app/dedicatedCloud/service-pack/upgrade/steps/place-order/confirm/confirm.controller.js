export default class {
  /* @ngInject */
  constructor(
    $translate,
    $uibModalInstance,
    hasDefaultMeansOfPayment,
    itemName,
    itemType,
    prices,
    isDowngrade,
  ) {
    this.$translate = $translate;
    this.$uibModalInstance = $uibModalInstance;
    this.hasDefaultMeansOfPayment = hasDefaultMeansOfPayment;
    this.itemName = itemName;
    this.itemType = itemType;
    this.prices = prices;
    this.isDowngrade = isDowngrade;
  }

  getTitle() {
    if (this.isDowngrade) {
      return this.$translate.instant(
        'confirm_order_' + this.itemType + '_downgrade_title');
    } else {
      return this.$translate.instant('confirm_order_' + this.itemType + '_title');
    }
  }

  getConfirmMessage() {
    if (this.isDowngrade) {
      return this.$translate.instant(
        'confirm_order_' + this.itemType + '_downgrade_question_1',
        { itemName: this.itemName, },
      );
    } else {
      return this.$translate.instant(
        'confirm_order_' + this.itemType + '_question_1',
        { itemName: this.itemName, },
      );
    }
  }

  $onInit() {
    if (this.isDowngrade) {
      this.addingOrDeducting = 'deducting';
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
}
