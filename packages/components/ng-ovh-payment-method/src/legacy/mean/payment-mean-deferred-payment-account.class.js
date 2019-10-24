import merge from 'lodash/merge';

import OvhPaymentMethod from '../../payment-method.class';
import OvhPaymentMean from './payment-mean.class';
import { PAYMENT_MEAN_TYPE_ENUM } from './payment-mean.constants';

export default class OvhPaymentMeanDeferredPaymentAccount extends OvhPaymentMean {
  constructor(options = {}) {
    super(merge(options, {
      meanType: PAYMENT_MEAN_TYPE_ENUM.DEFERRED_PAYMENT_ACCOUNT,
    }));

    this.creationDate = options.creationDate;
    this.label = options.label;
  }

  toPaymentMethod() {
    return new OvhPaymentMethod(merge(super.toPaymentMethod(), {
      label: this.label,
      creationDate: this.creationDate,
      original: this,
    }));
  }
}
