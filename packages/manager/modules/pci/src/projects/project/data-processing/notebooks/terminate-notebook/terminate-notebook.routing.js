export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.data-processing.notebooks.terminate',
    {
      url: '/terminate',
      views: {
        modal: {
          component: 'pciProjectDataProcessingQuickTerminateNotebookModal',
        },
      },
      layout: 'modal',
      params: {
        notebookId: null,
        notebookName: null,
        projectId: null,
      },
      resolve: {
        notebookId: /* @ngInject */ ($transition$) =>
          $transition$.params().notebookId,
        notebookName: /* @ngInject */ ($transition$) =>
          $transition$.params().notebookName,
        goBack: /* @ngInject */ (showNotebooks) => showNotebooks,
      },
    },
  );
};
