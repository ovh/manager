export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('web-paas.projects.cancel', {
    url: '/:projectId/cancel',
    views: {
      modal: {
        component: 'webPaasProjectTerminate',
      },
    },
    params: {
      projectId: null,
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
    atInternet: {
      ignore: true,
    },
  });
};
