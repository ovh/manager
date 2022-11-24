export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.data-processing.notebooks.details.terminate',
    {
      url: '/terminate',
      views: {
        modal: {
          component:
            'ovhManagerPciProjectDataProcessingNotebooksTerminateNotebook',
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
        goBack: /* @ngInject */ (showNotebook) => showNotebook,
      },
    },
  );
};
