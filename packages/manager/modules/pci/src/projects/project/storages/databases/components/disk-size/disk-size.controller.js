export default class DiskSizeController {
  $onInit() {
    this.checkRange();
  }

  checkRange() {
    if (this.lowLimitValue && this.model < this.lowLimitValue) {
      this.model = this.lowLimitValue;
    }
    if (this.model < this.min) {
      this.model = this.min;
    }
    if (this.model > this.max) {
      this.model = this.max;
    }
    if (this.onChange) {
      this.onChange();
    }
  }

  get price() {
    return (
      (this.showMonthlyPrices ? this.prices.monthly : this.prices.hourly)
        .priceInUcents *
      this.model *
      this.nodes
    );
  }

  get tax() {
    return (
      (this.showMonthlyPrices ? this.prices.monthly : this.prices.hourly).tax *
      this.model *
      this.nodes
    );
  }
}
