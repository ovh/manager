import merge from 'lodash/merge';
import snakeCase from 'lodash/snakeCase';

import OvhPaymentMethod from '../../payment-method.class';
import OvhPaymentMean from './payment-mean.class';
import { PAYMENT_MEAN_TYPE_ENUM } from './payment-mean.constants';

export default class OvhPaymentMeanCreditCard extends OvhPaymentMean {
  constructor(options = {}) {
    super(merge(options, {
      meanType: PAYMENT_MEAN_TYPE_ENUM.CREDIT_CARD,
    }));

    this.number = options.number;
    this.expirationDate = options.expirationDate;
    this.threeDsValidated = options.threeDsValidated;
    this.type = options.type;
  }

  toPaymentMethod() {
    return new OvhPaymentMethod(merge(super.toPaymentMethod(), {
      label: this.number,
      expirationDate: this.expirationDate,
      paymentSubType: snakeCase(this.type).toUpperCase(),
      original: this,
    }));
  }
}
