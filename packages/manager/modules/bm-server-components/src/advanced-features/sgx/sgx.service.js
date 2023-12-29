import isString from 'lodash/isString';
import toUpper from 'lodash/toUpper';

import { DOCUMENTATION_BY_SUB } from './sgx.constants';

export default class {
  /**
   * Get documentation about SGX
   * @param {string} sub - Subsidiary for the documentation
   * @returns {string?} the url to the documentation if it exists, otherwise returns undefined
   */
  static getDocumentation(sub) {
    if (!isString(sub)) {
      throw new TypeError('sub parameters should be of type String');
    }

    return DOCUMENTATION_BY_SUB[toUpper(sub)];
  }
}
