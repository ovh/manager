export default class {
  $onInit() {
    this.trackPage(this.orderPublicIpHitTracking);
  }

  onOrderPublicCancel() {
    this.trackClick(`${this.orderPublicIpHitTracking}::cancel`);

    return this.goBack();
  }
}
