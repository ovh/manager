export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.datacenters', {
    url: '/datacenters',
    reloadOnSearch: false,
    views: {
      pccView: 'ovhManagerPccDatacenters',
    },
    resolve: {
      addDatacenter: /* @ngInject */ ($state) => () =>
        $state.go('app.managedBaremetal.datacenters.add-datacenter'),
    },
  });
};
