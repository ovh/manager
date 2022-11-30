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
        projectId: null,
      },
      resolve: {
        notebookId: /* @ngInject */ ($transition$) =>
          $transition$.params().notebookId,
        goBack: /* @ngInject */ (showNotebooks) => showNotebooks,
      },
    },
  );
};
