export default class PrivateDatabaseLogsCtrl {
  /* @ngInject */
  constructor($scope, $stateParams, TailLogs, PrivateDatabaseLogsService) {
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.TailLogs = TailLogs;
    this.privateDatabaseLogsService = PrivateDatabaseLogsService;
    this.loader = true;

    $scope.$on('$destroy', () => {
      if (this.logger) {
        this.logger.stop();
      }
    });
  }

  $onInit() {
    this.loader = true;
    this.productId = this.$stateParams.productId;

    this.logger = new this.TailLogs({
      source: () =>
        this.privateDatabaseLogsService
          .getLogs(this.productId)
          .then((logs) => logs.url),
      delay: 2000,
    });

    this.startLog();
    this.loader = false;
  }

  $onDestroy() {
    this.logger.stop();
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
