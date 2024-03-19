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
      featureAvailability: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability([
            'dedicated-cloud:canAddVirtualDatacenter',
            'dedicated-cloud:migrationBanner',
          ])
          .then((result) => result),
      addVdcAvailable: /* @ngInject */ (featureAvailability) =>
        featureAvailability.isFeatureAvailable(
          'dedicated-cloud:canAddVirtualDatacenter',
        ),
      migrationBannerAvailable: /* @ngInject */ (featureAvailability) =>
        featureAvailability.isFeatureAvailable(
          'dedicated-cloud:migrationBanner',
        ),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_cloud_datacenters'),
      trackClick: /* @ngInject */ (atInternet, trackingPrefix) => (click) => {
        atInternet.trackClick({
          name: `${trackingPrefix}::details::${click}`,
          type: 'action',
        });
      },
    },
  });
};
