export default class FlavorBillingController {
  $onInit() {
    this.monthly = this.monthlyBilling === true;
    this.number = this.number || 1;

    this.disabled = this.disabled || false;
  }

  selectBilling(monthlyBilling) {
    this.monthlyBilling = monthlyBilling;
  }

  getPrice(price) {
    return this.number * price.value;
  }
}
