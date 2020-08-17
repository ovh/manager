import isString from 'lodash/isString';

import { convertLanguageFromOVHToBCP47 } from '@ovh-ux/manager-config';

import { PRICING_MODES } from './upscale.constants';

export default class {
  static convertPricingMode(pricingMode) {
    if (pricingMode.startsWith(PRICING_MODES.UPFRONT)) {
      return PRICING_MODES.UPFRONT;
    }

    return PRICING_MODES.MONTHLY;
  }

  /**
   * @param {@ovh-ux/manager-models:Price} price
   * @param {string} language Formatted the OVHcloud way
   */
  static buildPriceToDisplay({ value, currency }, language) {
    const bcp47Language = convertLanguageFromOVHToBCP47(language);

    return Intl.NumberFormat(bcp47Language, {
      style: 'currency',
      currency,
    }).format(value);
  }

  static validateLanguage(language) {
    if (!isString(language)) {
      throw new TypeError('Attribute "language" should be of type "string"');
    }
  }
}
