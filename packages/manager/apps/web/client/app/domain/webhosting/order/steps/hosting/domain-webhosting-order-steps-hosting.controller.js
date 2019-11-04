import chunk from 'lodash/chunk';
import sortBy from 'lodash/sortBy';

import { OPTIONS_DETAILS } from './domain-webhosting-order-steps-hosting.constants';

export default class {
  /* @ngInject */
  constructor(constants) {
    this.constants = constants;
  }

  $onInit() {
    this.showDetails = true;
    this.availableOffers = chunk(
      sortBy(
        this.availableOffers.map((offer) => {
          const order = OPTIONS_DETAILS
            .find(({ label }) => label === offer.planCode);

          Object.assign(
            offer,
            {
              id: order ? order.id : null,
              guideUrl: this.constants.urls.hosting[this.user.ovhSubsidiary],
            },
          );
          return offer;
        }),
        'id',
      ),
      3,
    );
  }

  updateOffer() {
    this.stepper.cartOption.offer = this.offer;
    this.stepper.currentIndex += 1;
  }
}
