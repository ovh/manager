export default class TelecomSmsBatchesHistoryDeleteCtrl {
  /* @ngInject */
  constructor($http, $translate, SmsService, TucToast) {
    this.isLoading = false;
    this.$http = $http;
    this.$translate = $translate;
    this.SmsService = SmsService;
    this.TucToast = TucToast;
  }

  delete() {
    this.isLoading = true;

    return this.SmsService.deleteBatchHistory(this.serviceName, this.batchId)
      .then(() => {
        this.onSuccess();
      })
      .catch(() => {
        this.onFailure();
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
