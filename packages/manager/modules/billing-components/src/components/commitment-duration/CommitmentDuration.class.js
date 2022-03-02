import { maxBy } from 'lodash-es';

export default class CommitmentDuration {
  /**
   *
   * @param {number} duration commitment duration in months
   * @param {Commitment[]} commitments commitments available for the given duration
   * @param {Pricing} currentPricing current pricing for the service
   * @param {Number} itemQuantity number of selected items
   */
  constructor(duration, commitments, currentPricing, itemQuantity = 1) {
    Object.assign(this, {
      duration,
      commitment: maxBy(commitments, 'pricing.monthlyPriceValue'),
    });

    if (currentPricing) {
      this.savings = currentPricing.getDiff(
        this.commitment.pricing,
        this.monthlyDuration,
        itemQuantity,
      );
    }
  }

  get monthlyDuration() {
    return moment.duration(this.duration).asMonths();
  }

  get monthlyPrice() {
    return this.commitment.pricing.monthlyPrice.text;
  }
}
