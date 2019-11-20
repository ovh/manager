export default /* @ngInject */$stateProvider => $stateProvider.state('pci.projects.project.data-processing.job-details.logs', {
  url: '/logs',
  component: 'dataprocessingJobLogsComponent',
  resolve: {
    // retrieve project id from url params
    projectId: $transition$ => $transition$.params().projectId,
    // retrieve job id from url params
    jobId: $transition$ => $transition$.params().jobId,
    job: ( // retrieve job from service
      dataProcessingService,
      projectId,
      jobId,
    ) => dataProcessingService.getJob(projectId, jobId),
    breadcrumb: $translate => $translate.instant('data_processing_details_logs_title'), // update breadcrumb with "/ Logs"
  },
});
