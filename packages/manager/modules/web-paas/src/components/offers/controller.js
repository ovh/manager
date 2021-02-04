import isFunction from 'lodash/isFunction';
import first from 'lodash/first';

export default class WebPaasOffersCtrl {
  $onInit() {
    if (this.offers && this.offers.length === 1) {
      this.selectedOffer = first(this.offers);
      this.selectedVcpu = first(this.selectedOffer.getCpu());
      this.onSelected(this.selectedOffer);
    }
  }

  onSelected(offer) {
    if (isFunction(this.onSelect)) {
      this.onSelect(offer);
    }
  }
}
