export default class {
  /* @ngInject */
  getAvailableDurations() {
    this.duration = undefined;

    this.availablePricings = this.stepper.cartOption.offer.pricings;
    if (!this.hasManyDurations()) {
      this.duration = this.availablePricings[0].duration;
      this.updateDuration();
    }
  }

  hasManyDurations() {
    return this.availablePricings.length > 1;
  }

  updateDuration() {
    this.stepper.cartOption.offer.pricing.duration = this.duration;
  }
}
