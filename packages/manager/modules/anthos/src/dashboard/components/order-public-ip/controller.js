export default class {
  onOrderPublicCancel() {
    this.trackClick(`${this.orderPublicIpHitTracking}::cancel`);

    return this.goBack();
  }
}
