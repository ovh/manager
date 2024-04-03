export default class {
  /* @ngInject */
  constructor($timeout, $window, RedirectionService) {
    this.$timeout = $timeout;
    this.$window = $window;
    this.expressOrderUrl = RedirectionService.getURL('expressOrder');
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

  goToPromocodeFunnel() {
    const productId = this.productName();
    // const checkoutObject = this.getCheckoutInformations();
    const jsUrlToSend = {
      productId,
      // configuration: checkoutObject.configuration,
      // ...checkoutObject.product,
    };
    return this.$window.open(
      `${this.expressOrderUrl}?products=${JSURL.stringify([jsUrlToSend])}`,
      '_blank',
      'noopener',
    );
  }

  updateDuration() {
    this.stepper.cartOption.offer.pricing.duration = this.duration;
  }
}
