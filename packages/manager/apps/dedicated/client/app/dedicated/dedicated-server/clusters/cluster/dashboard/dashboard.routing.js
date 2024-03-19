export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.dashboard', {
    url: '',
    views: {
      'tabView@app.dedicated-cluster.cluster': {
        component: 'clusterDashboard',
      },
    },
    resolve: {
      trackingPrefix: () => 'dedicated::dedicated-server::cluster::dashboard',
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cluster_general_information'),
      isCommitmentAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(['billing:commitment'])
          .then((commitmentAvailability) =>
            commitmentAvailability.isFeatureAvailable('billing:commitment'),
          )
          .catch(() => false),
    },
    atInternet: {
      rename: 'dedicated::dedicated-server::cluster::dashboard',
    },
  });
};
