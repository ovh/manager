import { ISO_DURATION_FORMAT } from './pricing.constants';

/**
 * Helper to convert a order.cart.GenericProductPricing
 * to a order.catalog.public.Pricing
 */
export default class GenericPricingHelper {
  /**
   * Convert the provided pricing to a catalog compliant pricing
   * The provided pricing follows the API order.cart.GenericProductPricing
   * schema
   * @param  {Object} pricing Generic pricing
   * @return {Object}         Formatted pricing
   */
  static convertToCatalogPricing(pricing) {
    const convertedPricing = pricing;
    if (!convertedPricing.intervalUnit) {
      convertedPricing.intervalUnit = GenericPricingHelper.getIntervalUnitFromDuration(
        pricing.duration,
      );
    }

    convertedPricing.mode = pricing.mode || pricing.pricingMode;
    convertedPricing.type = pricing.type || pricing.pricingType;
    convertedPricing.quantity = pricing.quantity || {
      max: pricing.maximumQuantity,
      min: pricing.minimumQuantity,
    };

    if (typeof convertedPricing.price !== 'number') {
      convertedPricing.price = pricing.priceInUcents;
    }

    convertedPricing.type = pricing.type || pricing.pricingType;

    return convertedPricing;
  }

  /**
   * Get the interval unit, from duration ISO 8601 format
   * @param  {string} duration Formatted duration
   * @return {string}          Interval unit
   */
  static getIntervalUnitFromDuration(duration) {
    const [, formattedIntervalUnit] = duration.match(/[A-Z]+/gi);
    let intervalUnit;
    Object.entries(ISO_DURATION_FORMAT).forEach(([key, value]) => {
      if (value === formattedIntervalUnit) {
        intervalUnit = key.toLowerCase();
      }
    });

    return intervalUnit;
  }
}
