export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.training.jobs.dashboard.general-information.delete',
    {
      url: '/delete',
      views: {
        modal: {
          component: 'ovhManagerPciProjectJobsDeleteJob',
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
