export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.node.dashboard.commitment',
    {
      url: '/commitment?duration',
      views: {
        'dashboard@app.dedicated-cluster.cluster.node.dashboard':
          'billingCommitment',
      },
      resolve: {
        goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
        duration: /* @ngInject */ ($transition$) =>
          $transition$.params().duration,
        serviceId: /* @ngInject */ (serviceInfos) => serviceInfos.serviceId,
        me: /* @ngInject */ (currentUser) => currentUser,
        trackingPrefix: () => 'dedicated::node::dashboard',
        pageTrackingPrefix: () =>
          'dedicated::dedicated-server::node::dashboard',
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('dedicated_server_dashboard_commit'),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
