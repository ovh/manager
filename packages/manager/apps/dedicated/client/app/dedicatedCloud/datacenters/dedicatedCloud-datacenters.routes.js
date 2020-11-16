export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.datacenter', {
    url: '/datacenter',
    reloadOnSearch: false,
    views: {
      pccView: 'ovhManagerPccDatacenters',
    },
    resolve: {
      addDatacenter: /* @ngInject */ ($state) => () =>
        $state.go('app.dedicatedCloud.details.datacenter.add-datacenter'),
      goToDatacenter: /* @ngInject */ ($state) => (datacenter) =>
        $state.go('app.dedicatedCloud.details.datacenter.details', {
          datacenterId: datacenter.name,
        }),
    },
  });
};
