export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.dashboard.update', {
    url: '/update',
    params: {
      targetVersion: null,
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
