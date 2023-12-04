export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.dashboard.logs', {
    url: '/logs',
    views: {
      jobView: 'ovhManagerPciProjectJobLogs',
    },
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
      jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
      job: /* @ngInject */ (PciProjectTrainingJobService, projectId, jobId) => {
        return PciProjectTrainingJobService.get(projectId, jobId);
      },
      jobLog: /* @ngInject */ (
        PciProjectTrainingJobService,
        projectId,
        jobId,
      ) => {
        return PciProjectTrainingJobService.logs(projectId, jobId);
      },
    },
  });
};
