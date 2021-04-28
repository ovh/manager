export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.dashboard.terminate', {
    url: '/terminate',
    views: {
      modal: {
        component: 'dedicatedServerDashboardTerminate',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
    },
  });
};
