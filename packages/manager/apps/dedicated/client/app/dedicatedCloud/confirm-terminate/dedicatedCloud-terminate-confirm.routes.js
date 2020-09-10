export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.terminate-confirm', {
    url: '/terminate-confirm?token',
    params: {
      token: null,
    },
    views: {
      modal: {
        component: 'dedicatedCloudTerminateConfirm',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goBackToDashboard) => goBackToDashboard,
      token: /* @ngInject */ ($transition$) => $transition$.params().token,
    },
  });
};
