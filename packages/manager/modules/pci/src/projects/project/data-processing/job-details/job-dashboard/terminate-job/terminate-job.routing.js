export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.data-processing.job-details.dashboard.terminate', {
      url: '/terminate',
      views: {
        modal: {
          component: 'dataprocessingTerminateJobModal',
        },
      },
      layout: 'modal',
      params: {
        jobId: null,
        jobName: null,
        projectId: null,
      },
      resolve: {
        projectId: $transition$ => $transition$.params().projectId,
        jobId: $transition$ => $transition$.params().jobId,
        jobName: $transition$ => $transition$.params().jobName,
      },
    });
};
