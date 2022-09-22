export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state(
    'pci.projects.project.data-processing.notebooks.details',
    {
      url: '/:notebookId',
      views: {
        'content@pci.projects.project.data-processing':
          'pciProjectDataProcessingNotebookDetails',
      },
      resolve: {
        // retrieve job id from url params
        notebookId: /* @ngInject */ ($transition$) =>
          $transition$.params().notebookId,
        notebook: /* @ngInject */ (
          // retrieve job from service
          dataProcessingService,
          projectId,
          notebookId,
        ) => dataProcessingService.getNotebook(projectId, notebookId),
        terminateNotebook: /* @ngInject */ (
          $state,
          projectId,
          notebook,
        ) => () => {
          $state.go(
            'pci.projects.project.data-processing.notebooks.terminate',
            {
              projectId,
              notebookId: notebook.Id,
            },
          );
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'data_processing_notebooks_details_dashboard_label',
          ), // update breadcrumb with "Dashboard"
      },
      atInternet: {
        name:
          'public-cloud::pci::projects::project::data-processing::job-details::dashboard',
      },
    },
  );
