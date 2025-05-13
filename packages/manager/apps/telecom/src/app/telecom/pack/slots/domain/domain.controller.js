export default /* @ngInject */ function PackDomainCtrl(
  $scope,
  coreURLBuilder,
  OvhApiPackXdslDomainActivation,
  $stateParams,
  $window,
) {
  const self = this;

  this.getWebDomain = function getWebDomain(domainName) {
    return coreURLBuilder.buildURL('web', '#/configuration/domain/:productId', {
      productId: domainName,
    });
  };

  const init = function init() {
    self.details = $scope.service;
    self.services = [];

    $scope.loaders = {
      services: true,
    };

    // Get service link to this access from current Pack Xdsl
    return OvhApiPackXdslDomainActivation.v6()
      .query({
        packId: $stateParams.packName,
      })
      .$promise.then(
        (services) => {
          angular.forEach(services, (service) => {
            self.services.push({
              name: service,
              encoded: $window.encodeURIComponent(service),
              tld: service.replace(/^.+\./, '.'),
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
