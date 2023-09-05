import {
  CHALLENGER_INDIA_CREDIT_CARD_LENGTH,
  CHALLENGER_INDIA_CREDIT_CARD_PLACEHODER,
} from './constants';

export default class PciProjectNewPaymentChallengeIndiaCtrl {
  constructor() {
    this.inputMaxLength = CHALLENGER_INDIA_CREDIT_CARD_LENGTH;
    this.inputPlaceHolder = CHALLENGER_INDIA_CREDIT_CARD_PLACEHODER;
  }
}
