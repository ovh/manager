import sortBy from 'lodash/sortBy';

export default class {
  /* @ngInject */
  constructor(constants) {
    this.constants = constants;
  }

  $onInit() {
    this.showDetails = true;
    this.availableOffers = sortBy(
      this.availableOffers.map(offer => Object.assign(
        offer,
        {
          guideUrl: this.constants.urls.hosting[this.user.ovhSubsidiary],
        },
      )),
      'pricing.price',
    );
  }

  updateOffer() {
    this.stepper.cartOption.offer = this.offer;
    this.stepper.currentIndex += 1;
  }
}
