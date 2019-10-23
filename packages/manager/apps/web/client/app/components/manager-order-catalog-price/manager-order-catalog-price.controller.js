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

    this.ASIA_FORMAT = ASIA_FORMAT;
    this.GERMAN_FORMAT = GERMAN_FORMAT;
    this.FRENCH_FORMAT = FRENCH_FORMAT;
    this.US_FORMAT = US_FORMAT;
  }

  $onInit() {
    // Support attribute without value to be evaluated to true
    if (!isUndefined(this.$attrs.block) && this.$attrs.block === '') {
      this.block = true;
    }

    this.ovhSubsidiary = this.user.ovhSubsidiary;
  }

  getPriceText(priceInCents) {
    if (this.FRENCH_FORMAT.includes(this.ovhSubsidiary)
      || this.GERMAN_FORMAT.includes(this.ovhSubsidiary)) {
      return `${priceInCents / 100000000}${this.user.currency.symbol}`;
    }
    return `${this.user.currency.symbol}${priceInCents / 100000000}`;
  }
}
