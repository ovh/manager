import { SPECIAL_CONDITIONS_SUBSIDIARIES } from './confirm-terminate.constants';

export default class TerminateServiceCtrl {
  /* @ngInject */
  constructor($translate, Alerter, BillingTerminate) {
    this.$translate = $translate;
    this.Alerter = Alerter;
    this.BillingTerminate = BillingTerminate;
  }

  $onInit() {
    this.model = {};
  }

  hasSpecialConditions() {
    return SPECIAL_CONDITIONS_SUBSIDIARIES.includes(this.user.ovhSubsidiary);
  }

  confirmTermination() {
    this.loading = true;
    return this.BillingTerminate.confirmTermination(this.service, this.token)
      .then(() => this.BillingTerminate.answerForm(this.service, this.model))
      .then(() =>
        this.Alerter.success(
          this.$translate.instant('billing_confirm_termination_success'),
        ),
      )
      .catch((error) =>
        this.Alerter.error(
          this.$translate.instant('billing_confirm_termination_error', {
            message: error.message,
          }),
        ),
      )
      .finally(() => {
        this.loading = false;
      });
  }
}
