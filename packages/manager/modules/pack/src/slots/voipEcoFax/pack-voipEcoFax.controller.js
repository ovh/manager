angular.module('managerApp').controller('PackVoipEcoFaxCtrl', function ($scope, OvhApiPackXdslVoipEcofax, $stateParams, REDIRECT_URLS) {
  const self = this;

  const init = function init() {
    self.details = $scope.service;
    self.services = [];

    $scope.loaders = {
      services: true,
    };

    // Get service link to this access from current Pack Xdsl
    return OvhApiPackXdslVoipEcofax.v6().query({
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

  self.generateV3Url = function (service) {
    // Build link to manager v3 for fax
    return REDIRECT_URLS.telephony.replace('{line}', service);
  };

  init();
});
