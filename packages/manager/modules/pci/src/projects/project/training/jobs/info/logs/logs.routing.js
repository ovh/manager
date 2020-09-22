export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.info.logs', {
    url: '/:jobId/logs',
    views: {
      'content@pci.projects.project.training.jobs.info':
        'pciProjectTrainingJobsInfoLogsComponent',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_job_logs_header'),
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
      goToJobKill: /* @ngInject */ ($state, projectId, jobId) => () =>
        $state.go('pci.projects.project.training.jobs.kill', {
          projectId,
          jobId,
          previousState: 'info',
        }),
    },
  });
};
