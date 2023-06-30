import sortBy from 'lodash/sortBy';
import capitalize from 'lodash/capitalize';
import { DOMAIN_TRACKING } from '../../../../../hosting/hosting.constants';

export default class {
  /* @ngInject */
  constructor(atInternet, HOSTING_ORDER_URL) {
    this.atInternet = atInternet;
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

  trackClick(hit) {
    return this.atInternet.trackClick({
      name: hit,
      type: 'action',
    });
  }

  updateOffer() {
    this.stepper.cartOption.offer = this.offer;
    this.stepper.currentIndex += 1;
  }

  trackOffer(groupOffer, versionOffer) {
    const { category, selectedVersion } = groupOffer;
    const { value } = selectedVersion;

    if (versionOffer) {
      this.trackClick(`${DOMAIN_TRACKING.STEP_1.SELECT_OFFER_LIST}${category}`);
    }

    this.trackClick(`${DOMAIN_TRACKING.STEP_1.SELECT_OFFER}${value}`);
  }

  onHostingGroupOfferClick(groupOffer, versionOffer) {
    this.offer = groupOffer.selectedVersion;
    this.stepper.cartOption.offer = groupOffer.selectedVersion;

    this.trackOffer(groupOffer, versionOffer);
  }

  onOfferNextStepClick() {
    this.trackClick(DOMAIN_TRACKING.STEP_1.GO_TO_NEXT_STEP);
  }
}
