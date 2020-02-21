export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.data-processing.job-details.dashboard.metrics-token',
    {
      url: '/metrics',
      views: {
        modal: {
          component: 'dataprocessingMetricsTokenModal',
        },
      },
      layout: 'modal',
      params: {
        jobId: null,
        projectId: null,
      },
      resolve: {
        projectId: ($transition$) => $transition$.params().projectId,
        jobId: ($transition$) => $transition$.params().jobId,
        metricsToken: (dataProcessingService, projectId) =>
          dataProcessingService.getMetricsToken(projectId),
      },
    },
  );
};
