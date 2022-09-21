export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.data-processing.notebooks.delete',
    {
      url: '/delete',
      views: {
        modal: {
          component: 'pciProjectDataProcessingQuickDeleteNotebookModal',
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
