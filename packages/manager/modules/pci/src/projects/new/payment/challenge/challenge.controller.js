import get from 'lodash/get';

import {
  PAYPAL_LOGIN_URL,
  PAYPAL_LOGIN_PARAMS,
  BUILD_PAYPAL_URL,
} from './challenge.constants';

export default class PciProjectsNewPaymentChallengeController {
  /* @ngInject */
  constructor(
    $state,
    $translate,
    CucCloudMessage,
    ovhPaymentMethod,
    ovhPaymentMethodHelper,
  ) {
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.ovhPaymentMethod = ovhPaymentMethod;
    this.isValidIban = ovhPaymentMethodHelper.isValidIban;
  }

  $onInit() {
    this.isChallenging = false;
    if (get(this.defaultPaymentMethod, 'paymentType') === 'CREDIT_CARD') {
      this.creditCardSuffix = this.defaultPaymentMethod.label.substring(6);
    }
    this.paypalUrl = BUILD_PAYPAL_URL(PAYPAL_LOGIN_URL, PAYPAL_LOGIN_PARAMS);
  }

  processChallenge() {
    this.CucCloudMessage.flushMessages();
    this.isChallenging = true;
    return this.ovhPaymentMethod
      .challengePaymentMethod(this.defaultPaymentMethod, this.challenge)
      .then(() => this.$state.go('pci.projects.new.payment', { challengeStatus: 'done' }, { reload: true }))
      .catch((error) => {
        if (error.status === 400) {
          this.CucCloudMessage.error(
            this.$translate.instant('pci_projects_new_payment_challenge_error_retry'),
          );
        }
        if (error.status === 404) {
          this.$state.go('pci.projects.new.payment', { challengeStatus: 'done' }, { reload: true })
            .then(() => this.CucCloudMessage.error(
              this.$translate.instant('pci_projects_new_payment_challenge_error_deactivated'),
            ));
        }
      })
      .finally(() => {
        this.isChallenging = false;
      });
  }
}
