export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.training.jobs.dashboard.general-information.resubmit',
    {
      url: '/resubmit',
      views: {
        modal: {
          component: 'ovhManagerPciProjectJobsResubmitJob',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
        job: /* @ngInject */ (
          PciProjectTrainingJobService,
          projectId,
          jobId,
        ) => {
          return PciProjectTrainingJobService.get(projectId, jobId);
        },
      },
    },
  );
};
