export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicated-server.server.dashboard.monitoringUpdate',
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
          $state.go('app.dedicated-server.server.dashboard'),
        breadcrumb: () => null,
      },
      atInternet: {
        rename:
          'dedicated::dedicated-server::server::dashboard::monitoringUpdate',
      },
    },
  );
};
