import get from 'lodash/get';

import {
  CHALLENGER_CREDIT_CARD_LENGTH,
  CHALLENGER_ERROR_CODES,
} from './constants';

export default class PciPaymentMethodChallenge {
  constructor(options = {}, ibanValidator) {
    this.value = options.value || null;
    this.error = options.error || null;
    this.checking = options.checking || false;

    this.ibanValidator = ibanValidator;
  }

  /* ----------  Error management  ---------- */

  setError(httpStatus) {
    this.error = get(
      CHALLENGER_ERROR_CODES,
      httpStatus,
      CHALLENGER_ERROR_CODES.DEFAULT,
    );
  }

  resetError() {
    this.error = null;
  }

  isValid(paymentType) {
    switch (paymentType) {
      case 'CREDIT_CARD':
        return (
          this.value && this.value.length === CHALLENGER_CREDIT_CARD_LENGTH
        );
      case 'BANK_ACCOUNT':
        return this.value && this.ibanValidator(this.value);
      default:
        return true;
    }
  }
}
