import find from 'lodash/find';
import set from 'lodash/set';
import capitalize from 'lodash/capitalize';
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
      this.onOfferSelect(this.selectedOffer);
    }
  }

  onOfferSelect(offer) {
    if (isFunction(this.onSelect)) {
      this.onSelect({ product: offer });
    }
  }

  /* eslint-disable-next-line class-methods-use-this */
  getPlanName(name) {
    return capitalize(name);
  }

  isValid(product) {
    return (
      this.PLAN_FAMILY_EXCLUDED.includes(product.name) &&
      this.PLAN_FAMILY_INCLUDED.includes(this.selectedPlan?.product)
    );
  }
}
