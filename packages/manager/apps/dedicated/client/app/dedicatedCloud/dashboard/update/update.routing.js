export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.dashboard.update', {
    url: '/update',
    params: {
      targetVersion: null,
      trackingPrefix: null,
    },
    views: {
      modal: {
        component: 'ovhManagerPccDashboardUpdate',
      },
    },
    layout: 'modal',
    resolve: {
      targetVersion: /* @ngInject */ ($transition$) =>
        $transition$.params().targetVersion,
      goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
    },
  });
};
