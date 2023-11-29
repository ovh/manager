export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.notebooks.dashboard.attach-data.data-sync',
    {
      url: '/data-sync/:volumeId',
      params: {
        volumeId: null,
        notebookId: null,
        directory: null,
      },
      views: {
        modal: {
          component: 'ovhManagerPciProjectNotebookAttachDataDataSyncModal',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ (goBackToAttachData) => goBackToAttachData,
        volumeId: /* @ngInject */ ($transition$) =>
          $transition$.params().volumeId,
        notebookId: /* @ngInject */ ($transition$) =>
          $transition$.params().notebookId,
        directory: /* @ngInject */ ($transition$) =>
          $transition$.params().directory,
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
