export default class FlavorBillingController {
  $onInit() {
    this.monthly = true;
    this.number = this.number || 1;
  }

  selectBilling(monthlyBilling) {
    this.monthlyBilling = monthlyBilling;
  }

  getPrice(price) {
    return this.number * price.value;
  }
}
