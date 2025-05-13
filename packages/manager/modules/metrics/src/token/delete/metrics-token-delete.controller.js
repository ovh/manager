export default class MetricsTokenDeleteCtrl {
  /* @ngInject */
  constructor($uibModalInstance, serviceName, tokenID, MetricService) {
    this.$uibModalInstance = $uibModalInstance;
    this.serviceName = serviceName;
    this.tokenID = tokenID;
    this.MetricService = MetricService;
  }

  confirm() {
    this.loading = true;
    return this.MetricService.deleteToken(this.serviceName, this.tokenID)
      .then((response) => this.$uibModalInstance.close(response))
      .catch((err) => this.$uibModalInstance.dismiss(err))
      .finally(() => {
        this.loading = false;
      });
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}
