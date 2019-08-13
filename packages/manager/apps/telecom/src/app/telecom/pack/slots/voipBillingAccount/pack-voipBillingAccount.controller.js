angular.module('managerApp').controller('PackVoipBillingAccountCtrl', function ($scope, OvhApiPackXdslVoipBillingAccount, $stateParams) {
  const self = this;

  const init = function init() {
    self.details = $scope.service;
    self.services = [];

    $scope.loaders = {
      services: true,
    };

    // Get service link to this access from current Pack Xdsl
    return OvhApiPackXdslVoipBillingAccount.v6().query({
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
