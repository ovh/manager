import filter from 'lodash/filter';
import get from 'lodash/get';
import map from 'lodash/map';

export default /* @ngInject */ function PackExchangeAccountCtrl(
  $scope,
  $http,
  $stateParams,
  OvhApiPackXdslExchangeAccount,
  REDIRECT_URLS,
) {
  const self = this;

  function init() {
    self.services = [];

    $scope.loaders = {
      services: true,
    };

    return OvhApiPackXdslExchangeAccount.Services()
      .v6()
      .query({
        packName: $stateParams.packName,
      })
      .$promise.then((serviceIds) =>
        $http
          .get('/email/exchange/*/service/*/account?$aggreg=1', {
            serviceType: 'apiv7',
          })
          .then((servicesParam) => {
            let services = servicesParam;
            services = get(services, 'data');
            self.services = filter(
              map(
                filter(services, (service) => service.value !== null),
                (service) => {
                  const splittedPath = service.path.split('/');
                  return angular.extend(service.value, {
                    organizationName: splittedPath[3],
                    exchangeService: splittedPath[5],
                    managerUrl: REDIRECT_URLS.exchangeAccount
                      .replace('{organizationName}', splittedPath[3])
                      .replace('{exchangeService}', splittedPath[5]),
                  });
                },
              ),
              (service) =>
                serviceIds.indexOf(`${service.exchangeService}-${service.id}`) >
                -1,
            );
          }),
      )
      .finally(() => {
        $scope.loaders.services = false;
      });
  }

  init();
}
