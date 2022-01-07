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
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_cloud_datacenters'),
      trackClick: /* @ngInject */ (atInternet) => (click) => {
        atInternet.trackClick({
          name: click,
          type: 'action',
        });
      },
      trackPage: /* @ngInject */ (atInternet) => (page) => {
        atInternet.trackPage({
          name: `dedicated::dedicatedCloud::details::${page}`,
          type: 'navigation',
        });
      },
    },
  });
};
