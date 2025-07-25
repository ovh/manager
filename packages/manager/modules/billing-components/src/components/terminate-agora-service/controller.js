export default class TerminateAgoraServiceController {
  /* @ngInject */
  constructor($translate, BillingTerminate, coreConfig) {
    this.$translate = $translate;
    this.BillingTerminate = BillingTerminate;
    this.hasMailConfirmation = !coreConfig.isRegion('US');
  }

  terminate() {
    return this.BillingTerminate.serviceTermination(
      this.id,
      this.hasMailConfirmation,
    );
  }

  onSuccess() {
    const messageKey = this.hasMailConfirmation
      ? 'autorenew_agora_terminate_service_success_'
      : 'autorenew_agora_terminate_service_success_ftc_';
    this.goBack(
      this.$translate.instant(`${messageKey}${this.serviceType}`, {
        serviceName: this.serviceName,
      }),
      'success',
    );
  }

  onError(error) {
    this.goBack(
      this.$translate.instant(
        `autorenew_agora_terminate_service_error_${this.serviceType}`,
        { error: error?.data?.message },
      ),
      'danger',
    );
  }
}
