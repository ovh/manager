angular.module('App').controller(
  'PrivateDatabaseLogsCtrl',
  class PrivateDatabaseLogsCtrl {
    constructor($scope, $stateParams, OvhTailLogs, PrivateDatabaseLogsService) {
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.OvhTailLogs = OvhTailLogs;
      this.privateDatabaseLogsService = PrivateDatabaseLogsService;
    }

    $onInit() {
      this.productId = this.$stateParams.productId;

      this.logger = new this.OvhTailLogs({
        source: () => this.privateDatabaseLogsService
          .getLogs(this.productId)
          .then(logs => logs.url),
        delay: 2000,
      });

      this.startLog();
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
  },
);
