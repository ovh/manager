export default /* @ngInject */ ($stateProvider) =>
  $stateProvider.state(
    'pci.projects.project.data-processing.job-details.logs',
    {
      url: '/logs',
      component: 'pciProjectDataProcessingJobLogs',
      resolve: {
        // retrieve job id from url params
        jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
        job: /* @ngInject */ (
          // retrieve job from service
          dataProcessingService,
          projectId,
          jobId,
        ) => dataProcessingService.getJob(projectId, jobId),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('data_processing_details_logs_title'), // update breadcrumb with "/ Logs"
      },
    },
  );
