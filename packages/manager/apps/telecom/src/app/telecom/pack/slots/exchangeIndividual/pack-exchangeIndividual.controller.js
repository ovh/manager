angular.module('managerApp').controller('PackExchangeIndividualCtrl', function ($scope, OvhApiPackXdslExchangeIndividual, $stateParams) {
  const self = this;
  self.exchangeMail = {};

  function init() {
    self.exchangeMail.details = $scope.service;
    self.exchangeMail.services = [];

    $scope.loaders = {
      services: true,
    };

    // Get service link to this access from current Pack Xdsl
    return OvhApiPackXdslExchangeIndividual.v6().query({
      packId: $stateParams.packName,
    }).$promise.then(
      (services) => {
        angular.forEach(services, (service) => {
          self.exchangeMail.services.push({
            name: service,
            domain: service.replace(/^.+\./, '.'),
          });
        });
        $scope.loaders.services = false;
      },
      () => {
        $scope.loaders.services = false;
      },
    );
  }

  init();
});
