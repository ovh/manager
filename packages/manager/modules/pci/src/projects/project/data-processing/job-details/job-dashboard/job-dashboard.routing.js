export default /* @ngInject */$stateProvider => $stateProvider.state('pci.projects.project.data-processing.job-details.dashboard', {
  url: '/dashboard',
  component: 'dataProcessingJobDetailsDashboardComponent',
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
    metricsToken: (
      dataProcessingService,
      projectId,
    ) => dataProcessingService.getMetricsToken(projectId),
    breadcrumb: $translate => $translate.instant('data_processing_details_dashboard_label'), // update breadcrumb with "Dashboard"
  },
});
