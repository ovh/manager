export default class LogsTokenAddCtrl {
  /* @ngInject */
  constructor(
    $q,
    $stateParams,
    $uibModalInstance,
    LogsTokensService,
    CucControllerHelper,
    CucCloudMessage,
  ) {
    this.$q = $q;
    this.$stateParams = $stateParams;
    this.$uibModalInstance = $uibModalInstance;
    this.serviceName = this.$stateParams.serviceName;
    this.LogsTokensService = LogsTokensService;
    this.CucControllerHelper = CucControllerHelper;
    this.CucCloudMessage = CucCloudMessage;
    this.initLoaders();
  }

  /**
   * initializes token
   *
   * @memberof LogsTokenAddCtrl
   */
  initLoaders() {
    this.token = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsTokensService.getNewToken(this.serviceName),
    });
    this.token.load();
    this.clusters = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsTokensService.getClusters(this.serviceName),
    });
    this.clusters.load();
  }

  /**
   * create new token
   *
   * @memberof LogsTokenAddCtrl
   */
  createToken() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.CucCloudMessage.flushChildMessage();
    this.saving = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.LogsTokensService.createToken(
          this.serviceName,
          this.token.data,
        ).finally(() => {
          this.$uibModalInstance.close();
          this.CucControllerHelper.scrollPageToTop();
        }),
    });
    return this.saving.load();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}
