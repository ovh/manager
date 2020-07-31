export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.info', {
    url: '/:jobId',
    component: 'pciProjectTrainingJobsInfoComponent',
    resolve: {
      breadcrumb: /* @ngInject */ (jobId) => jobId,
      jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
      job: /* @ngInject */ (PciProjectTrainingJobService, projectId, jobId) => {
        return PciProjectTrainingJobService.get(projectId, jobId);
      },
      goToJobKill: /* @ngInject */ ($state, projectId, jobId) => () =>
        $state.go('pci.projects.project.training.jobs.kill', {
          projectId,
          jobId,
          previousState: 'info',
        }),
    },
  });
};
