import get from 'lodash/get';

import {
  PAYMENT_TYPE_CREDIT_CARD,
  PAYMENT_TYPE_PAYPAL,
  PAYPAL_LOGIN_URL,
  PAYPAL_LOGIN_PARAMS,
  BUILD_PAYPAL_URL,
} from './challenge.constants';

export default class PciProjectsNewPaymentChallengeController {
  /* @ngInject */
  constructor(
    $state,
    ovhPaymentMethodHelper,
  ) {
    this.$state = $state;
    this.isValidIban = ovhPaymentMethodHelper.isValidIban;
  }

  $onInit() {
    this.isChallenging = false;
    if (get(this.defaultPaymentMethod, 'paymentType.value') === PAYMENT_TYPE_CREDIT_CARD) {
      this.creditCardSuffix = this.defaultPaymentMethod.label.replace(/(.{4})/g, '$1 ').trim().substring(7);
    }
    this.paypalUrl = BUILD_PAYPAL_URL(PAYPAL_LOGIN_URL, PAYPAL_LOGIN_PARAMS);

    if (this.from === PAYMENT_TYPE_PAYPAL) {
      if (this.challenge) {
        this.submitChallenge();
      }
      if (this.error) {
        this.displayRetryError();
      }
    }
  }

  submitChallenge() {
    this.isChallenging = true;
    return this.processChallenge(this.challenge)
      .finally(() => {
        this.isChallenging = false;
      });
  }
}
