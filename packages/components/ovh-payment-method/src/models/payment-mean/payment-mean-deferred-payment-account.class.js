import { merge } from 'lodash-es';

import { PaymentMean } from './payment-mean.class';
import { PaymentMethod } from '../payment-method.class';
import { PAYMENT_MEAN_TYPE_ENUM } from '../../enums/payment-mean.enum';

export class PaymentMeanDeferredPaymentAccount extends PaymentMean {
  constructor(options = {}) {
    super(
      merge(options, {
        meanType: PAYMENT_MEAN_TYPE_ENUM.DEFERRED_PAYMENT_ACCOUNT,
      }),
    );

    this.creationDate = options.creationDate;
    this.label = options.label;
  }

  toPaymentMethod() {
    return new PaymentMethod(
      merge(super.toPaymentMethod(), {
        label: this.label,
        creationDate: this.creationDate,
        original: this,
      }),
    );
  }
}

export default {
  PaymentMeanDeferredPaymentAccount,
};
