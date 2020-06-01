import { snakeCase } from 'lodash-es';

import OvhPaymentMethodType from '../../payment-method-type.class';

export default class OvhPaymentMeanType {
  constructor(options = {}) {
    this.meanType = options.value;
    this.registerable = options.registerable;
  }

  toPaymentMethodType() {
    return new OvhPaymentMethodType({
      paymentType: snakeCase(this.meanType).toUpperCase(),
      registerable: this.registerable,
      original: this,
    });
  }
}
