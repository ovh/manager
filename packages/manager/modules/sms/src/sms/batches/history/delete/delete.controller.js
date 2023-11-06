export default class TelecomSMSBatchesHistoryDeleteCtrl {
  /* @ngInject */
  constructor(
    $http,
    // Alerter,
    $translate,
  ) {
    this.isLoading = false;
    this.$http = $http;
    // this.Alerter = Alerter;
    this.$translate = $translate;
    console.log('test3');
  }

  delete() {
    this.isLoading = true;

    return this.SmsService.deleteBatchHistory(this.serviceName, this.batchId)
      .catch((error) => {
        this.error = get(error, 'data.message', error.message);
      })
      .finally(() => {
        this.isLoading = false;
      });
    }
}