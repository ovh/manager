import sortBy from 'lodash/sortBy';

export default class {
  /* @ngInject */
  constructor(ORDER_URLS) {
    this.ORDER_URLS = ORDER_URLS;
  }

  $onInit() {
    this.showDetails = true;
    this.availableOffers = sortBy(
      this.availableOffers.map((offer) =>
        Object.assign(offer, {
          guideUrl: this.ORDER_URLS.orderHosting[this.user.ovhSubsidiary],
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
