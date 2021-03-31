import isFunction from 'lodash/isFunction';

export default class WebPaasOffersCtrl {
  $onInit() {
    if (this.offers && this.offers.length === 1) {
      [this.selectedOffer] = this.offers;
      [this.selectedVcpu] = this.selectedOffer.getCpu();
      this.onSelected(this.selectedOffer);
    }
  }

  onSelected(offer) {
    if (isFunction(this.onSelect)) {
      this.onSelect(offer);
    }
  }
}
