export default class {
  $onInit() {
    this.trackPage(this.hostHitTracking);
  }

  onGoToOrderHost() {
    this.trackClick(`${this.hostHitTracking}::order-host`);

    return this.goToOrderHost();
  }
}
