import { TERMINATE_PATTERN } from './constants';

export default class TerminateAgoraServiceController {
  /* @ngInject */
  constructor($translate, BillingTerminate) {
    this.TERMINATE_PATTERN = TERMINATE_PATTERN;
    this.$translate = $translate;
    this.BillingTerminate = BillingTerminate;
  }

  terminate() {
    return this.BillingTerminate.serviceTermination(this.id);
  }

  onSuccess() {
    this.goBack(
      this.$translate.instant(
        `autorenew_agora_terminate_service_success_${this.serviceType}`,
      ),
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
