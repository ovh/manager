export default class {
  onOrderHostCancel() {
    this.trackClick(`${this.orderHostHitTracking}::cancel`);

    return this.goBack();
  }
}
