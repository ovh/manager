export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.delete-job', {
    url: '/delete-job/:jobId',
    views: {
      modal: {
        component: 'pciProjectTrainingJobsDeleteJobComponent',
      },
    },
    layout: 'modal',
    params: {
      previousState: null,
    },
    resolve: {
      breadcrumb: () => null,
      previousState: /* @ngInject */ ($transition$) => {
        return $transition$.params().previousState;
      },
      jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
      job: /* @ngInject */ (PciProjectTrainingJobService, projectId, jobId) => {
        return PciProjectTrainingJobService.get(projectId, jobId);
      },
      goToJobInfo: /* @ngInject */ ($state, projectId, jobId) => () =>
        $state.go('pci.projects.project.training.jobs.info', {
          projectId,
          jobId,
        }),
    },
  });
};
