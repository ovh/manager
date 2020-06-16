import sortBy from 'lodash/sortBy';

export default class {
  /* @ngInject */
  constructor(OVH_ORDER_URLS) {
    this.OVH_ORDER_URLS = OVH_ORDER_URLS;
  }

  $onInit() {
    this.showDetails = true;
    this.availableOffers = sortBy(
      this.availableOffers.map((offer) =>
        Object.assign(offer, {
          guideUrl: this.OVH_ORDER_URLS.orderHosting[this.user.ovhSubsidiary],
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
