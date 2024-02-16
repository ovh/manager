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
            'dedicated-cloud:migrationBannerFirst',
            'dedicated-cloud:migrationBannerSecond',
            'dedicated-cloud:canAddVirtualDatacenter',
          ])
          .then((result) => result),
      migrationBannerAvailable: /* @ngInject */ (featureAvailability) => ({
        firstBanner: featureAvailability.isFeatureAvailable(
          'dedicated-cloud:migrationBannerFirst',
        ),
        secondBanner: featureAvailability.isFeatureAvailable(
          'dedicated-cloud:migrationBannerSecond',
        ),
      }),
      addVdcAvailable: /* @ngInject */ (featureAvailability) =>
        featureAvailability.isFeatureAvailable(
          'dedicated-cloud:canAddVirtualDatacenter',
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
