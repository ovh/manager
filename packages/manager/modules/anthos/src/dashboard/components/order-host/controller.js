export default class {
  $onInit() {
    this.trackPage(this.orderHostHitTracking);
  }

  onOrderHostCancel() {
    this.trackClick(`${this.orderHostHitTracking}::cancel`);

    return this.goBack();
  }
}
