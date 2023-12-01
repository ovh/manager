export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-cluster.cluster.node.dashboard.monitoringUpdate',
    {
      url: '/monitoring/update',
      views: {
        modal: {
          component: 'serverMonitoring',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */ ($state) => () =>
          $state.go('app.dedicated-cluster.cluster.node.dashboard'),
        breadcrumb: () => null,
      },
      atInternet: {
        rename:
          'dedicated::dedicated-server::server::dashboard::monitoringUpdate',
      },
    },
  );
};
