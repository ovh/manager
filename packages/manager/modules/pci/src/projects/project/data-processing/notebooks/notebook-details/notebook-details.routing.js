import { DATA_PROCESSING_TRACKING_PREFIX } from '../../data-processing.constants';

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
        capabilities: /* @ngInject */ (
          // retrieve job from service
          dataProcessingService,
          projectId,
        ) => dataProcessingService.getNotebookCapabilities(projectId),
        terminateNotebook: /* @ngInject */ (
          $state,
          projectId,
          notebook,
        ) => () => {
          $state.go(
            'pci.projects.project.data-processing.notebooks.details.terminate',
            {
              projectId,
              notebookId: notebook.id,
            },
          );
        },
        deleteNotebook: /* @ngInject */ ($state, projectId, notebook) => () => {
          $state.go(
            'pci.projects.project.data-processing.notebooks.details.delete',
            {
              projectId,
              notebookId: notebook.id,
            },
          );
        },
        showNotebook: /* @ngInject */ ($state, projectId, notebookId) => () =>
          $state.go(
            'pci.projects.project.data-processing.notebooks.details',
            {
              projectId,
              notebookId,
            },
            {
              reload: true,
            },
          ),
        reloadState: /* @ngInject */ ($state) => () => {
          $state.go($state.current, {}, { reload: true });
        },
        openLiveCodeEditor: /* @ngInject */ ($window, notebook) => () =>
          $window.open(notebook.status.url, '_blank'),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'data_processing_notebooks_details_dashboard_label',
          ), // update breadcrumb with "Dashboard"
      },
      atInternet: {
        rename: `${DATA_PROCESSING_TRACKING_PREFIX}::notebooks::notebook-details::dashboard`,
      },
    },
  );
