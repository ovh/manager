import { ELIGIBILITY_ACTION_ENUM } from '../constants';

export default class PciEligibility {
  constructor(options = {}) {
    this.voucher = options.voucher;
    this.paymentMethodsAuthorized = options.paymentMethodsAuthorized;
    this.minimumCredit = options.minimumCredit;
    this.actionsRequired = options.actionsRequired || [];

    this.validPaymentMethods = [];
  }

  setOptions(options = {}) {
    Object.assign(this, options);
  }

  isAddPaymentMethodRequired() {
    return this.actionsRequired.includes(
      ELIGIBILITY_ACTION_ENUM.ADD_PAYMENT_MEHTOD,
    );
  }

  isAskIncreaseProjectsQuotaRequired() {
    return this.actionsRequired.includes(
      ELIGIBILITY_ACTION_ENUM.ASK_INCREASE_PROJECTS_QUOTA,
    );
  }

  isChallengePaymentMethodRequired() {
    return this.actionsRequired.includes(
      ELIGIBILITY_ACTION_ENUM.CHALLENGE_PAYMENT_METHOD,
    );
  }

  isVerifyPaypalRequired() {
    return this.actionsRequired.includes(ELIGIBILITY_ACTION_ENUM.VERIFY_PAYPAL);
  }

  setValidPaymentMethods(validPaymentMethods) {
    this.validPaymentMethods = validPaymentMethods;
  }

  isDefaultPaymentMethodChoiceRequired() {
    return this.validPaymentMethods.length;
  }
}
