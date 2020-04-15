import get from 'lodash/get';
import 'moment';

import GenericPricingHelper from './generic-pricing.helper';

import { PRICING_CAPACITIES, ISO_DURATION_FORMAT } from './pricing.constants';

/** Class representing a catalog Pricing.
 *  For class properties, see the order.catalog.public.Pricing[]
 *  in /order/catalog/public{/productName}
 */
export default class Pricing {
  /**
   * @param {Object} options  Class properties grouped.
   */
  constructor(options = {}) {
    const convertedPricing = GenericPricingHelper.convertToCatalogPricing(
      options,
    );

    Object.assign(this, convertedPricing);
  }

  /**
   * Determines whether the pricing is free or not
   * @return {boolean}
   */
  isFree() {
    return get(this, 'price') === 0;
  }

  /**
   * Get the ISO 8601 representation of the duration
   * @return {string} ISO8601 formatted duration
   */
  getDurationISOFormat() {
    const isoDurationFormat = this.intervalUnit.toUpperCase();
    const iso8601Unit = ISO_DURATION_FORMAT[isoDurationFormat];
    return moment.duration(this.interval, iso8601Unit).toISOString();
  }

  /**
   * Determines whether the pricing has extra pricing or not
   * @return {boolean}
   */
  hasExtraPricing() {
    return !!this.extraPricing;
  }

  /**
   * Determines if pricing has renew capacity
   * @return {boolean}
   */
  hasRenewCapacity() {
    return this.capacities.includes(PRICING_CAPACITIES.RENEW);
  }
}
