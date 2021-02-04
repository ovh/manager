export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.cancel', {
    url: '/:projectId/cancel',
    views: {
      modal: {
        component: 'webPaasTerminate',
      },
    },
    params: {
      projectName: null,
    },
    layout: 'modal',
    resolve: {
      projectId: /* @ngInject */ ($transition$) =>
        $transition$.params().projectId,
      projectName: /* @ngInject */ ($transition$) =>
        $transition$.params().projectName,
      goBack: /* @ngInject */ (goToWebPaas) => goToWebPaas,
      breadcrumb: () => null,
    },
  });
};
