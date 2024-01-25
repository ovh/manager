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
      migrationBannerAvailable: /* @ngInject */ (ovhFeatureFlipping) => {
        const firstBannerFeature = 'dedicated-cloud:migrationBannerFirst';
        const secondBannerFeature = 'dedicated-cloud:migrationBannerSecond';
        return ovhFeatureFlipping
          .checkFeatureAvailability([firstBannerFeature, secondBannerFeature])
          .then((result) => {
            return {
              firstBanner: result.isFeatureAvailable(firstBannerFeature),
              secondBanner: result.isFeatureAvailable(secondBannerFeature),
            };
          });
      },
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
