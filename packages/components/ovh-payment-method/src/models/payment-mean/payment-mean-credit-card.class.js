import { merge, snakeCase } from 'lodash-es';

import { PaymentMean } from './payment-mean.class';
import { PaymentMethod } from '../payment-method.class';
import { PAYMENT_MEAN_TYPE_ENUM } from '../../enums/payment-mean.enum';

export class PaymentMeanCreditCard extends PaymentMean {
  constructor(options = {}) {
    super(
      merge(options, {
        meanType: PAYMENT_MEAN_TYPE_ENUM.CREDIT_CARD,
      }),
    );

    this.number = options.number;
    this.expirationDate = options.expirationDate;
    this.threeDsValidated = options.threeDsValidated;
    this.type = options.type;
  }

  toPaymentMethod() {
    return new PaymentMethod(
      merge(super.toPaymentMethod(), {
        label: this.number,
        expirationDate: this.expirationDate,
        paymentSubType: snakeCase(this.type).toUpperCase(),
        original: this,
      }),
    );
  }
}

export default {
  PaymentMeanCreditCard,
};
