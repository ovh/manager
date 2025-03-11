import { TERMINATE_PATTERN } from './constants';

export default class TerminateVrackController {
  /* @ngInject */
  constructor($translate, BillingTerminate) {
    this.TERMINATE_PATTERN = TERMINATE_PATTERN;
    this.$translate = $translate;
    this.BillingTerminate = BillingTerminate;
  }

  terminate() {
    this.BillingTerminate.serviceTerminationForVrack(this.service)
      .then(() => this.onSuccess())
      .catch((error) => this.onError({ error }));
  }

  onSuccess() {
    this.goBack(
      this.$translate.instant(
        `autorenew_agora_terminate_service_success_VRACK`,
      ),
      'success',
    );
  }

  onError(error) {
    this.goBack(
      this.$translate.instant(`autorenew_agora_terminate_service_error_VRACK`, {
        error: error?.data?.message,
      }),
      'danger',
    );
  }
}
