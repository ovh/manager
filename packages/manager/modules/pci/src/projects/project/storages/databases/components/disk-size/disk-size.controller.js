export default class DiskSizeController {
  $onInit() {
    if (!this.initialValue) {
      this.initialValue = this.min;
    }
    this.checkRange();
  }

  checkRange() {
    if (this.model < this.initialValue) {
      this.model = this.initialValue;
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
