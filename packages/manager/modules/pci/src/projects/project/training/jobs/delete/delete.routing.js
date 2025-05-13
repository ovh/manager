export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.delete', {
    url: '/delete/:jobId',
    params: { jobId: null },
    views: {
      modal: {
        component: 'ovhManagerPciProjectTrainingDeleteJob',
      },
    },
    layout: 'modal',
    resolve: {
      jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
      job: /* @ngInject */ (PciProjectTrainingJobService, projectId, jobId) => {
        return PciProjectTrainingJobService.get(projectId, jobId);
      },
      goBack: (goToJobs) => goToJobs,
      breadcrumb: () => null,
    },
  });
};
