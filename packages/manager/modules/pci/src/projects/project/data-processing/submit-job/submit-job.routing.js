export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state('pci.projects.project.data-processing.submit-job', {
    url: '/submit-job',
    component: 'pciProjectDataProcessingSubmitJob',
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
    },
    atInternet: {
      rename:
        'public-cloud::pci::projects::project::data-processing::submit-job',
    },
  });
