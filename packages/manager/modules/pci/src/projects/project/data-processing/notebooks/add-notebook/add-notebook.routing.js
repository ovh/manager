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
          dataProcessingService.getCapabilities(projectId),
        goBack: /* @ngInject */ (showNotebooks) => showNotebooks,
        increaseQuotaLink: /* @ngInject */ ($state, projectId) =>
          $state.href('pci.projects.project.quota.increase', {
            projectId,
          }),
        prices: /* @ngInject */ (dataProcessingService, projectId) =>
          dataProcessingService.getPricesFromCatalog(projectId),
        user: /* @ngInject */ (SessionService) => SessionService.getUser(),
        goToObjectStorage: /* @ngInject */ ($state, projectId) => () =>
          $state.go('pci.projects.project.storages.object-storage.add', {
            projectId,
          }),
        aiNotebookLink: /* @ngInject */ ($state, projectId) => () =>
          $state.href('pci.projects.project.notebooks.add', {
            projectId,
          }),
        goToDashboard: /* @ngInject */ ($state, projectId) => (jobId) =>
          $state.go(
            'pci.projects.project.data-processing.job-details.dashboard',
            {
              projectId,
              jobId,
            },
            {
              reload: true,
            },
          ),
      },
      atInternet: {
        rename:
          'public-cloud::pci::projects::project::data-processing::add-notebook',
      },
    },
  );
