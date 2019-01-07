export default /* @ngInject */ function ($scope, $stateParams, OvhApiOverTheBox, TailLogs) {
  const self = this;

  self.logger = null;

  self.stopLog = function stopLog() {
    self.logger.stop();
  };

  self.startLog = function startLog() {
    self.logger.log();
  };

  self.getLogs = function getLogs() {
    self.logger = self.logger.logs;
    return self.logger;
  };

  function init() {
    self.logger = new TailLogs({
      source() {
        return OvhApiOverTheBox.v6().getLogs({
          serviceName: $stateParams.serviceName,
        }, {}).$promise.then(logs => logs.url);
      },
      delay: 2000,
    });

    self.startLog();
  }


  init();

  $scope.$on('$destroy', () => {
    self.logger.stop();
  });
}
