import map from 'lodash/map';
import set from 'lodash/set';

export default /* @ngInject */ function PackAccessCtrl(
  $q,
  $scope,
  OvhApiPackXdslAccess,
  OvhApiXdslLines,
  $stateParams,
) {
  const self = this;
  const init = function init() {
    self.details = $scope.service;
    self.services = [];

    $scope.loaders = {
      services: true,
    };

    // Get service link to this access from current Pack Xdsl
    return OvhApiPackXdslAccess.Aapi()
      .query({
        packId: $stateParams.packName,
      })
      .$promise.then(
        (services) => {
          $q.all(
            map(services, (service) =>
              OvhApiXdslLines.v6()
                .query({
                  xdslId: service.accessName,
                })
                .$promise.then((lines) => {
                  set(service, 'lines', lines);
                  return {
                    ...service,
                    lines,
                  };
                }),
            ),
          ).then((results) => {
            angular.forEach(results, (result) => {
              self.services.push(result);
            });
          });

          $scope.loaders.services = false;
        },
        () => {
          $scope.loaders.services = false;
        },
      );
  };

  init();
}
