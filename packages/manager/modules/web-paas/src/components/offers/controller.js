import find from 'lodash/find';
import set from 'lodash/set';
import isFunction from 'lodash/isFunction';
import { PLAN_FAMILY_INCLUDED, PLAN_FAMILY_EXCLUDED } from './constants';

export default class WebPaasOffersCtrl {
  $onInit() {
    this.PLAN_FAMILY_INCLUDED = PLAN_FAMILY_INCLUDED;
    this.PLAN_FAMILY_EXCLUDED = PLAN_FAMILY_EXCLUDED;
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
      this.PLAN_FAMILY_EXCLUDED.includes(product.name) &&
      this.PLAN_FAMILY_INCLUDED.includes(this.selectedPlan?.product)
    );
  }
}
