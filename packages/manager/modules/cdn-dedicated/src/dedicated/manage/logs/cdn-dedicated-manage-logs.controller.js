export default class CdnLogsCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, OvhApiCdn, TailLogs) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.OvhApiCdn = OvhApiCdn;
    this.TailLogs = TailLogs;
  }

  $onInit() {
    this.logger = new this.TailLogs({
      source: () =>
        this.OvhApiCdn.Dedicated()
          .v6()
          .logs(
            {
              serviceName: this.$stateParams.productId,
            },
            {},
          )
          .$promise.then((logs) => logs.url),
      delay: 2000,
    });

    this.startLog();
  }

  $onDestroy() {
    this.stopLog();
  }

  stopLog() {
    this.logger.stop();
  }

  startLog() {
    this.logger.log();
  }

  getLogs() {
    this.logger = this.logger.logs;
    return this.logger;
  }
}
