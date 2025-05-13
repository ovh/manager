export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.data-processing.jobs.job-details.dashboard.terminate',
    {
      url: '/terminate',
      views: {
        modal: {
          component: 'pciProjectDataProcessingTerminateJobModal',
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
        jobName: /* @ngInject */ ($transition$) =>
          $transition$.params().jobName,
        goBack: /* @ngInject */ (showJob, jobId) => () => showJob(jobId),
      },
    },
  );
};
