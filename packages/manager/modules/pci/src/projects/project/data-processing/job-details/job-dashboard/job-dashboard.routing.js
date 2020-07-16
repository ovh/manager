export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state(
    'pci.projects.project.data-processing.job-details.dashboard',
    {
      url: '/dashboard',
      component: 'pciProjectDataProcessingJobDetailsDashboard',
      resolve: {
        // retrieve job id from url params
        jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
        job: /* @ngInject */ (
          // retrieve job from service
          dataProcessingService,
          projectId,
          jobId,
        ) => dataProcessingService.getJob(projectId, jobId),
        metricsToken: /* @ngInject */ (dataProcessingService, projectId) =>
          dataProcessingService.getMetricsToken(projectId),
        terminateJob: /* @ngInject */ ($state, projectId, job) => () => {
          $state.go(
            'pci.projects.project.data-processing.job-details.dashboard.terminate',
            {
              projectId,
              jobId: job.id,
              jobName: job.name,
            },
          );
        },
        showMetrics: /* @ngInject */ ($state, projectId, job) => () => {
          $state.go(
            'pci.projects.project.data-processing.job-details.dashboard.metrics-token',
            {
              projectId,
              jobId: job.id,
              jobName: job.name,
            },
          );
        },
        showBillingConsole: /* @ngInject */ ($state, projectId) => () => {
          $state.go('pci.projects.project.billing', {
            projectId,
          });
        },
        browseObjectStorage: /* @ngInject */ ($state, projectId) => (
          containerId,
        ) => {
          $state.go('pci.projects.project.storages.objects.object', {
            projectId,
            containerId,
          });
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('data_processing_details_dashboard_label'), // update breadcrumb with "Dashboard"
      },
      atInternet: {
        name:
          'public-cloud::pci::projects::project::data-processing::job-details::dashboard',
      },
    },
  );
