import { maxBy } from 'lodash-es';

export default class CommitmentDuration {
  /**
   *
   * @param {number} duration commitment duration in months
   * @param {Commitment[]} commitments commitments available for the given duration
   * @param {Pricing} currentPricing current pricing for the service
   */
  constructor(duration, commitments, currentPricing) {
    Object.assign(this, {
      duration,
      commitment: maxBy(commitments, 'pricing.monthlyPriceValue'),
    });

    this.savings = currentPricing.getDiff(
      this.commitment.pricing,
      this.duration,
    );
  }

  get monthlyPrice() {
    return this.commitment.pricing.monthlyPrice.text;
  }
}
