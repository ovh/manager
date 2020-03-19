import isString from 'lodash/isString';

import TranslateService from '../../../core/src/translate/translate.service';
import { UNITS } from '../../../models/Price/price.constants';

export default class {
  /**
   * @param {@ovh-ux/manager-models:Price} price
   * @param {string} language Formatted the OVHcloud way
   */
  static buildPriceToDisplay({ value, unit, currency }, language) {
    const bcp47Language = TranslateService.convertFromOVHToBCP47(language);

    const valueToFormat = unit === UNITS.MICROCENTS ? value / 100000000 : value;

    return Intl.NumberFormat(bcp47Language, {
      style: 'currency',
      currency,
    }).format(valueToFormat);
  }

  static validateLanguage(language) {
    if (!isString(language)) {
      throw new TypeError('Attribute "language" should be of type "string"');
    }
  }
}
