export default class {
  /* @ngInject */
  constructor($timeout) {
    this.$timeout = $timeout;
  }

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

    // Necessary as the update of stepper.currentIndex
    // has to be made after $digest cycle is finished
    this.$timeout(() => {
      this.stepper.currentIndex += 1;
    });
  }
}
