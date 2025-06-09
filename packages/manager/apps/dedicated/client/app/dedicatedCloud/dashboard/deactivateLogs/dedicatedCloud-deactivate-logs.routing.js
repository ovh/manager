export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.dashboard.deactivate-logs', {
    url: '/deactivate-logs',
    views: {
      modal: {
        component: 'ovhManagerPccDeactivateLogs',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
      breadcrumb: () => null,
    },
  });
};
