import { merge } from 'lodash-es';

import { PaymentMean } from './payment-mean.class';
import { PaymentMethod } from '../payment-method.class';
import { PAYMENT_MEAN_TYPE_ENUM } from '../../enums/payment-mean.enum';

export class PaymentMeanPaypal extends PaymentMean {
  constructor(options = {}) {
    super(
      merge(options, {
        meanType: PAYMENT_MEAN_TYPE_ENUM.PAYPAL,
      }),
    );

    this.email = options.email;
    this.agreementId = options.agreementId;
    this.creationDate = options.creationDate;
  }

  toPaymentMethod() {
    return new PaymentMethod(
      merge(super.toPaymentMethod(), {
        label: this.email,
        creationDate: this.creationDate,
        original: this,
      }),
    );
  }
}

export default {
  PaymentMeanPaypal,
};
