export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard.migration', {
    url: '/migration',
    resolve: {
      goBack: /* @ngInject */ (goToDashboard) => goToDashboard,
    },
    views: {
      modal: {
        component: 'ipDashboardMigration',
      },
    },
    layout: 'modal',
  });
};
