export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.data-processing.terminate', {
      url: '/terminate',
      views: {
        modal: {
          component: 'dataprocessingQuickTerminateJobModal',
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
