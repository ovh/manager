export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.details.terminate-confirm', {
    url: '/terminate-confirm',
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
      breadcrumb: () => null,
    },
  });
};
