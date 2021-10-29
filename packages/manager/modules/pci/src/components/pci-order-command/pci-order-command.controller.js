import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import isBoolean from 'lodash/isBoolean';
import isNull from 'lodash/isNull';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import isEmpty from 'lodash/isEmpty';
import forOwn from 'lodash/forOwn';

export default class {
  $onInit() {
    this.orderDataKeys = this.parameterKeys;
    if (!this.parameterKeys) {
      this.orderDataKeys = Object.keys(
        this.flattenObject(this.orderData, '', {}, false),
      );
    }
  }

  getRequestData() {
    return JSON.stringify(this.orderData, undefined, 4);
  }

  /**
   * This method flatten objects so that
   * {
   *  property1 : 1,
   *  property2 : {
   *    subproperty1 : a,
   *    subproperty2 : b
   *  }
   * }
   * is rewritten as
   * {
   *  property1 : 1,
   *  property2.subproperty1 : a,
   *  property2.subproperty2 : b
   * }
   * @param {object} objectToFlatten Object to flatten
   * @param {string} prefix Prefix to add to the current properties of the object (allow recursivity)
   * @param {object} resultMerging Object representing the result to merge with
   * @param {boolean} keepNull Whether or not we keep the null objects
   * @returns the flatten object
   */
  flattenObject(
    objectToFlatten,
    prefix = '',
    resultMerging = {},
    keepNull = true,
  ) {
    const result = resultMerging;
    if (
      isString(objectToFlatten) ||
      isNumber(objectToFlatten) ||
      isBoolean(objectToFlatten) ||
      (keepNull && isNull(objectToFlatten))
    ) {
      result[prefix] = objectToFlatten;
      return result;
    }

    if (isArray(objectToFlatten) || isPlainObject(objectToFlatten)) {
      forOwn(objectToFlatten, (value, key) => {
        let pref = prefix;
        if (isArray(objectToFlatten)) {
          pref += `[${key}]`;
        } else {
          pref = isEmpty(prefix) ? key : `${prefix}.${key}`;
        }
        this.flattenObject(value, pref, result, keepNull);
      });
      return result;
    }
    return result;
  }

  static formatKey(key) {
    return key.replaceAll(/\./g, '_');
  }
}
