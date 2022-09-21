export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('pci.projects.project.data-processing.notebooks', {
    url: '/notebooks?id',
    component: 'pciProjectDataProcessingNotebooks',
    params: {
      id: {
        dynamic: true,
        type: 'string',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('data_processing_notebooks'),
      addNotebook: /* @ngInject */ ($state, projectId) => () =>
        $state.go(
          'pci.projects.project.data-processing.notebooks.add-notebook',
          {
            projectId,
          },
        ),
      showNotebook: /* @ngInject */ ($state, projectId) => (notebookId) =>
        $state.go(
          'pci.projects.project.data-processing.notebooks.notebook-details.dashboard',
          {
            projectId,
            notebookId,
          },
          {
            reload: true,
          },
        ),
      showNotebooks: /* @ngInject */ ($state, projectId) => () =>
        $state.go(
          'pci.projects.project.data-processing.notebooks',
          { projectId },
          {
            reload: true,
          },
        ),
      terminateNotebook: /* @ngInject */ ($state, projectId) => (
        notebookId,
        notebookName,
      ) => {
        $state.go('pci.projects.project.data-processing.notebooks.terminate', {
          projectId,
          notebookId,
          notebookName,
        });
      },
      deleteNotebook: /* @ngInject */ ($state, projectId) => (
        notebookId,
        notebookName,
      ) => {
        $state.go('pci.projects.project.data-processing.notebooks.delete', {
          projectId,
          notebookId,
          notebookName,
        });
      },
      notebookId: /* @ngInject */ ($transition$) => $transition$.params().id,
      lab: /* @ngInject */ (PciProjectLabsService, projectId) =>
        PciProjectLabsService.getLabByName(projectId, 'dataProcessing'),
    },
    atInternet: {
      rename: 'public-cloud::pci::projects::project::data-processing',
    },
  });
