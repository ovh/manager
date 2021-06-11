import { snakeCase } from 'lodash-es';

import { AvailablePaymentMethod } from '../available-payment-method.class';

export class AvailablePaymentMean {
  constructor(options = {}) {
    this.meanType = options.value;
    this.registerable = options.registerable;
  }

  toAvailablePaymentMethod() {
    return new AvailablePaymentMethod({
      paymentType: snakeCase(this.meanType).toUpperCase(),
      registerable: this.registerable,
      original: this,
    });
  }
}

export default {
  AvailablePaymentMean,
};
