import get from 'lodash/get';
import isUndefined from 'lodash/isUndefined';

import { Environment } from '@ovh-ux/manager-config';

import {
  ASIA_FORMAT,
  FRENCH_FORMAT,
  GERMAN_FORMAT,
  US_FORMAT,
  INTERVAL_UNIT,
} from './catalog-price.constants';

export default class {
  /* @ngInject */
  constructor($attrs) {
    this.$attrs = $attrs;
    this.isUndefined = isUndefined;
  }

  $onInit() {
    // Support attribute without value to be evaluated to true
    if (!isUndefined(this.$attrs.block) && this.$attrs.block === '') {
      this.block = true;
    }

    if (
      !isUndefined(this.$attrs.convertToUcents) &&
      this.$attrs.convertToUcents === ''
    ) {
      this.convertToUcents = true;
    }

    if (!this.$attrs.performRounding) {
      this.performRounding = true;
    }

    if (this.convertToUcents) {
      this.price *= 100000000;
      this.tax *= 100000000;
    }

    this.ovhSubsidiary = get(this.user, 'ovhSubsidiary', '');
  }

  /**
   * Transform the price in uCents to a human readable and regionalized text based values
   * @param priceInCents the price to format
   * @returns {string} the formatted and regionalized prices, appended with currency unit.
   */
  getPriceText(priceInCents) {
    const locale = Environment.getUserLocale().replace('_', '-');

    let price = priceInCents / 100000000;
    price = this.performRounding
      ? this.getIntervalPrice(price)
      : this.getIntervalPriceWithoutRounding(price);

    const numberFormatOptions = {
      style: 'currency',
      currency: this.user.currency.code,
    };

    if (!isUndefined(this.minimumFractionDigits)) {
      numberFormatOptions.minimumFractionDigits = this.minimumFractionDigits;
    }

    if (!isUndefined(this.maximumFractionDigits)) {
      numberFormatOptions.maximumFractionDigits = this.maximumFractionDigits;
    }

    return new Intl.NumberFormat(locale, numberFormatOptions).format(price);
  }

  /**
   * Perform a specific price computation for a given time interval (day, month and year).
   * If your time interval is not amongst these, the price will be returned as is, as no specific computation is needed
   * @param price the price on which to apply the computation
   * @returns {number|*} the computed price if the time interval required it or the input price otherwise
   */
  getIntervalPriceWithoutRounding(price) {
    if (isUndefined(this.interval)) {
      return price;
    }

    switch (this.interval) {
      case INTERVAL_UNIT.DAY:
        return price / 365;
      case INTERVAL_UNIT.MONTH:
        return price / 12;
      case INTERVAL_UNIT.YEAR:
        return price;
      default:
        return price;
    }
  }

  /**
   * Perform a specific price computation for a given time interval (day, month and year).
   * If your time interval is not amongst these, the price will be used as is, as no specific computation is needed
   * In both cases, the resulting price is also rounded
   * @param price the price on which to apply the computation and to round
   * @returns {number|*} the computed price if the time interval required it or the input price otherwise, rounded
   */
  getIntervalPrice(price) {
    if (isUndefined(this.interval)) {
      return Math.round(price * 100) / 100;
    }

    switch (this.interval) {
      case INTERVAL_UNIT.DAY:
        return Math.round((price / 365) * 100) / 100;
      case INTERVAL_UNIT.MONTH:
        return Math.round((price / 12) * 100) / 100;
      case INTERVAL_UNIT.YEAR:
        return Math.round(price * 100) / 100;
      default:
        return Math.round(price * 100) / 100;
    }
  }

  /**
   * Check if the OVH subsidiary is amongst the ones using a generic Asian format to display their prices
   * @returns {boolean} true if the price must be displayed in a generic Asian format
   */
  isAsiaFormat() {
    return ASIA_FORMAT.includes(this.ovhSubsidiary);
  }

  /**
   * Check if the OVH subsidiary is amongst the ones using a generic European (French) format to display their prices
   * @returns {boolean} true if the price must be displayed in a generic european/French format
   */
  isFrenchFormat() {
    return FRENCH_FORMAT.includes(this.ovhSubsidiary);
  }

  /**
   * Check if the OVH subsidiary is amongst the ones using a German format to display their prices
   * @returns {boolean} true if the price must be displayed in a generic european/German format
   */
  isGermanFormat() {
    return GERMAN_FORMAT.includes(this.ovhSubsidiary);
  }

  /**
   * Check if the OVH subsidiary is amongst the ones using an US format to display their prices
   * @returns {boolean} true if the price must be displayed in a generic US format
   */
  isUSFormat() {
    return US_FORMAT.includes(this.ovhSubsidiary);
  }
}
