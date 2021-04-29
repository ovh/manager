import find from 'lodash/find';
import set from 'lodash/set';
import isFunction from 'lodash/isFunction';

export default class WebPaasOffersCtrl {
  $onInit() {
    this.planFamily = ['develop', 'expand'];
    this.previewMode = true;
    if (this.offers && this.offers.length > 0) {
      if (this.selectedPlan) {
        this.selectedOffer = find(this.offers, {
          name: this.selectedPlan.product,
        });
        set(
          this.selectedOffer,
          'selectedPlan',
          find(this.selectedOffer.plans, {
            planCode: this.selectedPlan.planCode,
          }),
        );
      } else {
        [this.selectedOffer] = this.offers;
      }
      this.onSelected(this.selectedOffer);
    }
  }

  onSelected(offer) {
    if (isFunction(this.onSelect)) {
      this.onSelect({ product: offer });
    }
  }

  isValid(product) {
    return (
      (product.name === 'start' || product.name === 'start-1') &&
      this.planFamily.includes(this.selectedPlan?.product)
    );
  }
}
