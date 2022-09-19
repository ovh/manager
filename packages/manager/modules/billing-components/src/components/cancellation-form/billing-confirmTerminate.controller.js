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

  terminateService() {
    this.loading = true;
    return this.confirmTermination(this.service)
      .then(() => this.BillingTerminate.answerForm(this.service, this.model))
      .then(() => this.success())
      .catch((err) => this.error(err))
      .finally(() => {
        this.loading = false;
      });
  }

  terminateByoipService() {
    this.loading = true;
    return this.BillingTerminate.terminateByoipService(this.serviceId)
      .then(() => this.success())
      .catch((err) => this.error(err))
      .finally(() => {
        this.loading = false;
      });
  }

  terminate() {
    return this.service.serviceType === 'IP_SERVICE'
      ? this.terminateByoipService()
      : this.terminateService();
  }

  success() {
    return this.goBack
      ? this.goBack(true)
      : this.Alerter.success(
          this.$translate.instant('billing_confirm_termination_success'),
        );
  }

  error(error) {
    this.Alerter.error(
      this.$translate.instant('billing_confirm_termination_error', {
        message: error.message,
      }),
    );
  }
}
