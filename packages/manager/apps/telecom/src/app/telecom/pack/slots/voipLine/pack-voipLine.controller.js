angular.module('managerApp').controller('PackVoipLineCtrl', function ($scope, OvhApiPackXdslVoipLine, $stateParams) {
  const self = this;

  const init = function init() {
    self.details = $scope.service;
    self.services = [];

    $scope.loaders = {
      services: true,
    };

    // Get service link to this access from current Pack Xdsl
    return OvhApiPackXdslVoipLine.Aapi().query({
      packId: $stateParams.packName,
    }).$promise.then(
      (services) => {
        angular.forEach(services, (service) => {
          self.services.push(service);
        });
        $scope.loaders.services = false;
      },
      () => {
        $scope.loaders.services = false;
      },
    );
  };

  init();
});
