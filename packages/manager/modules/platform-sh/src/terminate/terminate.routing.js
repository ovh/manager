export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'platform-sh.cancel',
    {
      url: '/:projectId/cancel',
      views: {
        modal: {
          component: 'platformShTerminate',
        },
      },
      params: {
        projectName: null,
      },
      layout: 'modal',
      resolve: {
        projectId: /* @ngInject */ ($transition$) => $transition$.params().projectId,
        projectName: /* @ngInject */ ($transition$) => $transition$.params().projectName,
        goBack: /* @ngInject */ (goToPlatformSh) =>
          goToPlatformSh,
        breadcrumb: () => null,
      },
    },
  );
};
