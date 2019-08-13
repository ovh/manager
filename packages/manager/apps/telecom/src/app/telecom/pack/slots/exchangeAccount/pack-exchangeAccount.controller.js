angular.module('managerApp').controller('PackExchangeAccountCtrl', function ($scope, $http, $stateParams, OvhApiPackXdslExchangeAccount, REDIRECT_URLS) {
  const self = this;

  function init() {
    self.services = [];

    $scope.loaders = {
      services: true,
    };

    return OvhApiPackXdslExchangeAccount.Services().v6().query({
      packName: $stateParams.packName,
    }).$promise.then(serviceIds => $http.get('/email/exchange/*/service/*/account?$aggreg=1', {
      serviceType: 'apiv7',
    }).then((servicesParam) => {
      let services = servicesParam;
      services = _.get(services, 'data');
      self.services = _.chain(services).filter(service => service.value !== null).map((service) => {
        const splittedPath = service.path.split('/');
        return angular.extend(service.value, {
          organizationName: splittedPath[3],
          exchangeService: splittedPath[5],
          managerUrl: REDIRECT_URLS.exchangeAccount.replace('{organizationName}', splittedPath[3]).replace('{exchangeService}', splittedPath[5]),
        });
      }).filter(service => serviceIds.indexOf(`${service.exchangeService}-${service.id}`) > -1)
        .value();
    })).finally(() => {
      $scope.loaders.services = false;
    });
  }

  init();
});
