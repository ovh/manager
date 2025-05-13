import sortBy from 'lodash/sortBy';
import { ORDER_WEBHOSTING_TRACKING } from '../../domain-webhosting-order.constants';

export default class {
  /* @ngInject */
  constructor(atInternet, HOSTING_ORDER_URL) {
    this.atInternet = atInternet;
    this.HOSTING_ORDER_URL = HOSTING_ORDER_URL;
  }

  $onInit() {
    this.offer = undefined;
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

  trackClick(hit) {
    return this.atInternet.trackClick({
      ...hit,
      type: 'action',
    });
  }

  updateOffer() {
    this.stepper.cartOption.offer = this.offer;
    this.stepper.currentIndex += 1;
  }

  onHostingGroupOfferClick(groupOffer) {
    this.offer = groupOffer.selectedVersion;
    this.stepper.cartOption.offer = groupOffer.selectedVersion;
  }

  onOptionEdit() {
    if (this.offer) {
      this.trackClick(ORDER_WEBHOSTING_TRACKING.OPTION.EDIT);
    }
  }

  onOfferNextStepClick() {
    this.trackClick({
      ...ORDER_WEBHOSTING_TRACKING.OPTION.NEXT,
      name: ORDER_WEBHOSTING_TRACKING.OPTION.NEXT.name.replace(
        /{{hostingSolution}}/g,
        this.offer.planCode,
      ),
    });
  }

  onChangeSwitchDetail() {
    this.showDetails = !this.showDetails;
    this.trackClick({
      ...ORDER_WEBHOSTING_TRACKING.OPTION.DETAIL,
      name: ORDER_WEBHOSTING_TRACKING.OPTION.DETAIL.name.replace(
        /{{status}}/g,
        this.showDetails ? 'on' : 'off',
      ),
    });
  }
}
