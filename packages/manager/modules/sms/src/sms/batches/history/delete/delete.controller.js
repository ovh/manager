export default class TelecomSmsBatchesHistoryDeleteCtrl {
  /* @ngInject */
  constructor($http, Alerter, $translate, SmsService) {
    this.isLoading = false;
    this.$http = $http;
    this.Alerter = Alerter;
    this.$translate = $translate;
    this.SmsService = SmsService;
  }

  delete() {
    this.isLoading = true;

    return this.SmsService.deleteBatchHistory(this.serviceName, this.batchId)
      .then(() => {
        this.Alerter.success(
          this.$translate.instant(
            'sms_batches_history_delete_confirmation_message',
          ),
          'telecom.main.alerter',
        );
        this.goBack(true);
      })
      .catch(() => {
        this.Alerter.error(
          this.$translate.instant('sms_batches_history_delete_error_message'),
          'telecom.main.alerter',
        );
        this.goBack();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
