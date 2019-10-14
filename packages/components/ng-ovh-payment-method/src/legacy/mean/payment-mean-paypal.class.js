import merge from 'lodash/merge';

import OvhPaymentMethod from '../../payment-method.class';
import OvhPaymentMean from './payment-mean.class';
import { PAYMENT_MEAN_TYPE_ENUM } from './payment-mean.constants';

export default class OvhPaymentMeanPaypal extends OvhPaymentMean {
  constructor(options = {}) {
    super(merge(options, {
      meanType: PAYMENT_MEAN_TYPE_ENUM.PAYPAL,
    }));

    this.email = options.email;
    this.agreementId = options.agreementId;
    this.creationDate = options.creationDate;
  }

  toPaymentMethod() {
    return new OvhPaymentMethod(merge(super.toPaymentMethod(), {
      label: this.email,
      creationDate: this.creationDate,
      original: this,
    }));
  }
}
