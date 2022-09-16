export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('pci.projects.project.data-processing.jobs.submit-job', {
    url: '/submit-job',
    views: {
      'content@pci.projects.project.data-processing':
        'pciProjectDataProcessingSubmitJob',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('data_processing_submit_job_title'),
      capabilities: /* @ngInject */ (dataProcessingService, projectId) =>
        dataProcessingService.getCapabilities(projectId),
      goBack: /* @ngInject */ (showJobs) => showJobs,
      increaseQuotaLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.quota.increase', {
          projectId,
        }),
      prices: /* @ngInject */ (dataProcessingService, projectId) =>
        dataProcessingService.getPricesFromCatalog(projectId),
      user: /* @ngInject */ (SessionService) => SessionService.getUser(),
      containers: /* @ngInject */ (PciStoragesContainersService, projectId) =>
        PciStoragesContainersService.getAll(projectId),
      goToObjectStorage: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.object-storage.add', {
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
        'public-cloud::pci::projects::project::data-processing::submit-job',
    },
  });
