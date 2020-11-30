export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.kill', {
    url: '/kill/:jobId',
    views: {
      modal: {
        component: 'pciProjectTrainingJobsKillComponent',
      },
    },
    layout: 'modal',
    params: {
      previousState: null,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_job_kill'),
      jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
      previousState: /* @ngInject */ ($transition$) => {
        return $transition$.params().previousState;
      },
      job: /* @ngInject */ (PciProjectTrainingJobService, projectId, jobId) => {
        return PciProjectTrainingJobService.get(projectId, jobId);
      },
      killJob: /* @ngInject */ (
        PciProjectTrainingJobService,
        projectId,
        jobId,
      ) => () => PciProjectTrainingJobService.kill(projectId, jobId),
      goToJobInfo: /* @ngInject */ ($state, projectId, jobId) => () =>
        $state.go('pci.projects.project.training.jobs.info', {
          projectId,
          jobId,
        }),
    },
  });
};
