import { DATA_PROCESSING_TRACKING_PREFIX } from '../../data-processing.constants';

export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state(
    'pci.projects.project.data-processing.notebooks.add-notebook',
    {
      url: '/add-notebook',
      views: {
        'content@pci.projects.project.data-processing':
          'pciProjectDataProcessingAddNotebook',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('data_processing_add_notebook_title'),
        capabilities: /* @ngInject */ (dataProcessingService, projectId) =>
          dataProcessingService.getNotebookCapabilities(projectId),
        goBack: /* @ngInject */ (showNotebooks) => showNotebooks,
        prices: /* @ngInject */ (dataProcessingService, projectId) =>
          dataProcessingService.getNotebookPricesFromCatalog(projectId),
        user: /* @ngInject */ (SessionService) => SessionService.getUser(),
        goToAiNotebook: /* @ngInject */ ($state, projectId) => () => {
          return $state.go('pci.projects.project.notebooks.add', {
            projectId,
          });
        },
        goToDashboard: /* @ngInject */ ($state, projectId) => (notebookId) =>
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
        goToCommand: /* @ngInject */ ($state) => (data) => {
          return $state.go(
            'pci.projects.project.data-processing.notebooks.add-notebook.command',
            {
              data,
            },
          );
        },
      },
      atInternet: {
        rename: `${DATA_PROCESSING_TRACKING_PREFIX}::notebooks::add`,
      },
    },
  );
