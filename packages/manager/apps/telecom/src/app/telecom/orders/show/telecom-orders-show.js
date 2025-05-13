angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.orders.show', {
    url: '/:serviceName',
    redirectTo: (trans) => {
      const $q = trans.injector().get('$q');
      const $http = trans.injector().get('$http');
      const { serviceName } = trans.params();
      return $q
        .all({
          xdsl: $http.get(`/xdsl/${serviceName}`),
          lines: $http.get(`/xdsl/${serviceName}/lines`),
        })
        .then(({ xdsl, lines }) => ({ xdsl: xdsl.data, lines: lines.data }))
        .then(({ xdsl, lines }) => ({
          state: 'telecom.packs.pack.xdsl.line.access-order',
          params: {
            serviceName: xdsl.accessName,
            packName: xdsl.packName,
            number: lines[0],
          },
        }));
    },
  });
});
