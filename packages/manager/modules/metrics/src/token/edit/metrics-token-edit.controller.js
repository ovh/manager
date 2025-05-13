export default class MetricsTokenEditCtrl {
  /* @ngInject */
  constructor(
    $uibModalInstance,
    CucControllerHelper,
    metricsValue,
    metricsType,
    serviceName,
    tokenID,
    MetricService,
  ) {
    this.$uibModalInstance = $uibModalInstance;
    this.CucControllerHelper = CucControllerHelper;
    this.MetricService = MetricService;
    this.serviceName = serviceName;
    this.tokenID = tokenID;
    this.type = metricsType;
    this.value = metricsValue;
  }

  confirm() {
    if (this.type === 'name') {
      this.deleteToken = this.CucControllerHelper.request.getHashLoader({
        loaderFunction: () =>
          this.MetricService.updateToken(
            this.serviceName,
            this.tokenID,
            this.value,
          )
            .then((response) => this.$uibModalInstance.close(response))
            .catch((err) => this.$uibModalInstance.dismiss(err)),
      });
      this.deleteToken.load();
    }
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}
