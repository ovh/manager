import sortBy from 'lodash/sortBy';
import capitalize from 'lodash/capitalize';

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

    this.hostingOffers = this.availableOffers.map((offer) => ({
      value: offer,
      name: capitalize(offer.toLowerCase()).replace('_', ' '),
    }));
  }

  updateOffer() {
    this.stepper.cartOption.offer = this.offer;
    this.stepper.currentIndex += 1;
  }

  onHostingOfferClick({ selectedVersion }) {
    this.offer = selectedVersion;
    this.stepper.cartOption.offer = selectedVersion;
  }
}
