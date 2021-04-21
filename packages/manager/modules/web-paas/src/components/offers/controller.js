import isFunction from 'lodash/isFunction';

export default class WebPaasOffersCtrl {
  $onInit() {
    this.planFamily = ['develop', 'expand', 'start', 'start-1'];
    this.previewMode = true;
    if (this.offers && this.offers.length > 0) {
      [this.selectedOffer] = this.offers;
      // [this.selectedVcpu] = this.selectedOffer.getCpu();
      this.onSelected(this.selectedOffer);
    }
  }

  onSelected(offer) {
    if (isFunction(this.onSelect)) {
      this.onSelect({ product: offer });
    }
  }
}
