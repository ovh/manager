import { snakeCase } from 'lodash-es';

import OvhAvailablePaymentMethod from '../../available-payment-method.class';

export default class OvhPaymentMeanType {
  constructor(options = {}) {
    this.meanType = options.value;
    this.registerable = options.registerable;
  }

  /**
   * @deprecated: use toAvailablePaymentMethod instead.
   */
  toPaymentMethodType() {
    return this.toAvailablePaymentMethod();
  }

  toAvailablePaymentMethod() {
    return new OvhAvailablePaymentMethod({
      paymentType: snakeCase(this.meanType).toUpperCase(),
      registerable: this.registerable,
      original: this,
    });
  }
}
