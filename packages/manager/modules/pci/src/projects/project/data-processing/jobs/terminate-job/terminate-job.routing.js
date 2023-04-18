export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.data-processing.jobs.terminate', {
    url: '/terminate',
    views: {
      modal: {
        component: 'pciProjectDataProcessingQuickTerminateJobModal',
      },
    },
    layout: 'modal',
    params: {
      jobId: null,
      jobName: null,
      projectId: null,
    },
    resolve: {
      jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
      jobName: /* @ngInject */ ($transition$) => $transition$.params().jobName,
      goBack: /* @ngInject */ (showJobs) => showJobs,
    },
  });
};
