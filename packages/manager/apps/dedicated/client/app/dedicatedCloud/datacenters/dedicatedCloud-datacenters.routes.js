export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenters', {
    url: '/datacenters',
    reloadOnSearch: false,
    views: {
      pccView: 'ovhManagerPccDatacenters',
    },
    resolve: {
      addDatacenter: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedClouds.datacenters.add-datacenter'),
      goToDatacenter: /* @ngInject */ ($state) => (datacenter) =>
        $state.go('app.dedicatedClouds.datacenter', {
          datacenterId: datacenter.name,
        }),
    },
  });
};
