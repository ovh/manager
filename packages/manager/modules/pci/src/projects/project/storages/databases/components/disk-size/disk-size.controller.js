export default class DiskSizeController {
  /* @ngInject */
  constructor($scope, $timeout) {
    this.$scope = $scope;
    this.$timeout = $timeout;
  }

  $onInit() {
    this.$scope.$watch('$ctrl.flavor', () => {
      this.min = this.initialValue
        ? Math.max(this.flavor.minDiskSize, this.initialValue)
        : this.flavor.minDiskSize;
      this.max = this.flavor.maxDiskSize;
      this.$timeout(() => {
        this.model = this.min;
      });
    });
  }

  checkRange() {
    if (this.model < this.min) {
      this.model = this.min;
    }
    if (this.model > this.max) {
      this.model = this.max;
    }
    this.onChange();
  }

  onMinusClick() {
    this.model -= this.step;
    this.checkRange();
  }

  onPlusClick() {
    this.model += this.step;
    this.checkRange();
  }
}
