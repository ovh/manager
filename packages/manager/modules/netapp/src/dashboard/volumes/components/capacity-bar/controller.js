export default class CapacityBarCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
  }

  $onInit() {
    this.percentages = {
      usedData: this.calculatePercentage(this.usedData),
      availableData: this.calculatePercentage(this.availableData),
      overflow: this.calculatePercentage(this.overflow),
      usedReserve: this.calculatePercentage(this.usedReserve),
      availableReserve: this.calculatePercentage(this.availableReserve),
    };
  }

  calculatePercentage(data) {
    return Number(data) ? `${(data / this.space) * 100}%` : 0;
  }
}
