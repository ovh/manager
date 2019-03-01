angular.module('managerApp').directive('uniqueVlanId', ($q, $stateParams, OvhApiCloudProjectNetworkPrivate) => ({
  require: 'ngModel',
  restrict: 'A',
  link(scope, elm, attrs, ngModel) {
    _.set(ngModel, '$asyncValidators.uniqueVlanId', (value) => {
      if (ngModel.$isEmpty(value)) {
        return $q.when();
      }

      const defer = $q.defer();

      OvhApiCloudProjectNetworkPrivate.v6().query({
        serviceName: $stateParams.projectId,
      }).$promise.then((networks) => {
        if (_.find(networks, { vlanId: value })) {
          defer.reject();
        } else {
          defer.resolve();
        }
      }, () => {
        defer.resolve();
      });

      return defer.promise;
    });
  },
}));
