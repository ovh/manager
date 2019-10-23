import isUndefined from 'lodash/isUndefined';

import {
  ASIA_FORMAT,
  FRENCH_FORMAT,
  GERMAN_FORMAT,
  US_FORMAT,
  INTERVAL_UNIT,
} from './manager-order-catalog-price.constants';

export default class {
  /* @ngInject */
  constructor($attrs) {
    this.$attrs = $attrs;
  }

  $onInit() {
    // Support attribute without value to be evaluated to true
    if (!isUndefined(this.$attrs.block) && this.$attrs.block === '') {
      this.block = true;
    }

    this.ovhSubsidiary = this.user.ovhSubsidiary;
  }

  getPriceText(priceInCents) {
    const price = this.getIntervalPrice(priceInCents / 100000000);

    if (this.isFrenchFormat() || this.isGermanFormat()) {
      return `${price}${this.user.currency.symbol}`;
    }
    return `${this.user.currency.symbol}${price}`;
  }

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

  isAsiaFormat() {
    return ASIA_FORMAT.includes(this.ovhSubsidiary);
  }

  isFrenchFormat() {
    return FRENCH_FORMAT.includes(this.ovhSubsidiary);
  }

  isGermanFormat() {
    return GERMAN_FORMAT.includes(this.ovhSubsidiary);
  }

  isUSFormat() {
    return US_FORMAT.includes(this.ovhSubsidiary);
  }
}
