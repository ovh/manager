import includes from 'lodash/includes';
import isNumber from 'lodash/isNumber';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import values from 'lodash/values';

import { UNITS } from './price.constants';

const PriceClass = class {
  /**
   * @param {string} currency
   * @param {UNITS} unit
   * @param {number} value the price expressed in the "unit" for the "currency"
   */
  constructor(price) {
    if (!isObject(price)) {
      throw new TypeError('Attribute "price" should be of type "object"');
    }

    if (!isNumber(price.value)) {
      throw new TypeError('Attribute "price.value" should be of type "number"');
    }

    if (!includes(values(UNITS), price.unit)) {
      throw new RangeError(
        `Attribute "price.unit" has an invalid value: ${price.unit}`,
      );
    }

    if (!isString(price.currency)) {
      throw new TypeError(
        `Attribute "price.currency" should be of type "string"`,
      );
    }

    this.currency = price.currency;
    this.unit = price.unit;
    this.value = this.constructor.convertPriceValueFromUnit(
      this.unit,
      price.value,
    );
  }

  static convertPriceValueFromUnit(priceUnit, priceValue) {
    return priceUnit === UNITS.MICROCENTS ? priceValue / 100000000 : priceValue;
  }
};

const Price = Object.assign(PriceClass, { UNITS });

export default Price;
