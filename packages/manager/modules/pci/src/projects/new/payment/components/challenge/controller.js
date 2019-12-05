import {
  CHALLENGER_CREDIT_CARD_LENGTH,
  CHALLENGER_CREDIT_CARD_PLACEHODER,
} from './constants';

export default class PciProjectNewPaymentChallengeCtrl {
  constructor() {
    this.inputMaxLength = CHALLENGER_CREDIT_CARD_LENGTH;
    this.inputPlaceHolder = CHALLENGER_CREDIT_CARD_PLACEHODER;
  }
}
