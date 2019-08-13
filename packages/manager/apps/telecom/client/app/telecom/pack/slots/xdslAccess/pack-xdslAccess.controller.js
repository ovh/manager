/* global async */
angular.module('managerApp').controller('PackAccessCtrl', function ($scope, OvhApiPackXdslAccess, OvhApiXdslLines, $stateParams) {
  const self = this;
  const init = function init() {
    self.details = $scope.service;
    self.services = [];

    $scope.loaders = {
      services: true,
    };

    // Get service link to this access from current Pack Xdsl
    return OvhApiPackXdslAccess.Aapi().query({
      packId: $stateParams.packName,
    }).$promise.then(
      (services) => {
        async.map(services, (service, callback) => {
          OvhApiXdslLines.v6().query({
            xdslId: service.accessName,
          }).$promise.then((lines) => {
            _.set(service, 'lines', lines);
            callback(null, service);
          }, (err) => {
            callback(err);
          });
        }, (err, results) => {
          if (err) {
            return;
          }

          angular.forEach(results, (result) => {
            self.services.push(result);
          });

          $scope.loaders.services = false;
        });
      },
      () => {
        $scope.loaders.services = false;
      },
    );
  };

  init();
});
