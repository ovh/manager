import sortBy from 'lodash/sortBy';

export default class {
  /* @ngInject */
  constructor(HOSTING_ORDER_URL) {
    this.HOSTING_ORDER_URL = HOSTING_ORDER_URL;
  }

  $onInit() {
    this.showDetails = true;
    this.availableOffers = sortBy(
      this.availableOffers.map((offer) =>
        Object.assign(offer, {
          guideUrl: this.HOSTING_ORDER_URL[this.user.ovhSubsidiary],
        }),
      ),
      'pricing.price',
    );
  }

  updateOffer() {
    this.stepper.cartOption.offer = this.offer;
    this.stepper.currentIndex += 1;
  }
}
