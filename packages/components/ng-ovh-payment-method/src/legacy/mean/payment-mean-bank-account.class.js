import merge from 'lodash/merge';

import OvhPaymentMethod from '../../payment-method.class';
import OvhPaymentMean from './payment-mean.class';
import { PAYMENT_MEAN_TYPE_ENUM } from './payment-mean.constants';

export default class OvhPaymentMeanBankAccount extends OvhPaymentMean {
  constructor(options = {}) {
    super(merge(options, {
      meanType: PAYMENT_MEAN_TYPE_ENUM.BANK_ACCOUNT,
    }));

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
    return new OvhPaymentMethod(merge(super.toPaymentMethod(), {
      label: this.iban,
      creationDate: this.creationDate,
      original: this,
    }));
  }
}
