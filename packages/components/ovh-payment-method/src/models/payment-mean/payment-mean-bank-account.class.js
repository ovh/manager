import { merge } from 'lodash-es';

import { PaymentMean } from './payment-mean.class';
import { PaymentMethod } from '../payment-method.class';
import { PAYMENT_MEAN_TYPE_ENUM } from '../../enums/payment-mean.enum';

export class PaymentMeanBankAccount extends PaymentMean {
  constructor(options = {}) {
    super(
      merge(options, {
        meanType: PAYMENT_MEAN_TYPE_ENUM.BANK_ACCOUNT,
      }),
    );

    this.validationDocumentLink = options.validationDocumentLink;
    this.uniqueReference = options.uniqueReference;
    this.creationDate = options.creationDate;
    this.mandateSignatureDate = options.mandateSignatureDate;
    this.ownerAddress = options.ownerAddress;
    this.iban = options.iban;
    this.ownerName = options.ownerName;
    this.bic = options.bic;
  }

  toPaymentMethod() {
    return new PaymentMethod(
      merge(super.toPaymentMethod(), {
        label: this.iban,
        creationDate: this.creationDate,
        original: this,
      }),
    );
  }
}

export default {
  PaymentMeanBankAccount,
};
