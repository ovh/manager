export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.ai.apps.dashboard.attach-data.data-sync',
    {
      url: '/data-sync/:volumeId',
      params: {
        volumeId: null,
        appId: null,
        directory: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciProjectAppAttachDataDataSyncModal',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToAttachData) => goBackToAttachData,
        volumeId: /* @ngInject */ ($transition$) =>
          $transition$.params().volumeId,
        appId: /* @ngInject */ ($transition$) => $transition$.params().appId,
        directory: /* @ngInject */ ($transition$) =>
          $transition$.params().directory,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
