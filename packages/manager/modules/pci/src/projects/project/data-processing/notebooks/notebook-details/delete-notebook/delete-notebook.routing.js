export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.data-processing.notebooks.details.delete',
    {
      url: '/delete',
      views: {
        modal: {
          component:
            'ovhManagerPciProjectDataProcessingNotebooksDeleteNotebook',
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
      atInternet: {
        rename:
          'PublicCloud::pci::projects::project::data-processing::notebooks::delete-notebook',
      },
    },
  );
};
