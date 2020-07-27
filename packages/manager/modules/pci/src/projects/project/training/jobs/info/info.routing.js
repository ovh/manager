export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.info', {
    url: '/:jobId',
    component: 'pciProjectTrainingJobsInfoComponent',
    resolve: {
      breadcrumb: /* @ngInject */ (jobId) => jobId,
      jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
      job: /* @ngInject */ (
        PciProjectTrainingJobsService,
        projectId,
        jobId,
      ) => {
        return PciProjectTrainingJobsService.get(projectId, jobId);
      },
    },
  });
};
