export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.dashboard', {
    url: '',
    views: {
      'tabView@app.dedicated-cluster.cluster': {
        component: 'clusterDashboard',
      },
    },
    resolve: {
      breadcrumb: () => null,
      isCommitmentAvailable: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping
          .checkFeatureAvailability(['billing:commitment'])
          .then((commitmentAvailability) =>
            commitmentAvailability.isFeatureAvailable('billing:commitment'),
          )
          .catch(() => false),
    },
  });
};
