export default class {
  onGoToOrderHost() {
    this.trackClick(`${this.hostHitTracking}::order-host`);

    return this.goToOrderHost();
  }
}
