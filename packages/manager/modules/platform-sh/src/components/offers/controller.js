import isFunction from 'lodash/isFunction';

export default class PlatformShOffersCtrl {
  $onInit() {
    if (this.offers && this.offers.length === 1) {
      this.selectedOffer = this.offers[0];
      this.selectedVcpu = this.selectedOffer.vcpus[0];
      this.onSelected(this.selectedOffer);
    }
  }

  onSelected(offer) {
    if (isFunction(this.onSelect)) {
      this.onSelect(offer);
    }
  }
}
