export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.kill', {
    url: '/kill/:jobId?previousState',
    views: {
      modal: {
        component: 'pciProjectTrainingJobsKillComponent',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_job_kill'),
      jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
      previousState: /* @ngInject */ ($transition$) => {
        return $transition$.params().previousState;
      },
      job: /* @ngInject */ (
        PciProjectTrainingJobsService,
        projectId,
        jobId,
      ) => {
        return PciProjectTrainingJobsService.get(projectId, jobId);
      },
      killJob: /* @ngInject */ (
        PciProjectTrainingJobsService,
        projectId,
        jobId,
      ) => () => PciProjectTrainingJobsService.kill(projectId, jobId),
      goToJobInfo: /* @ngInject */ ($state, projectId, jobId) => () =>
        $state.go('pci.projects.project.training.jobs.info', {
          projectId,
          jobId,
        }),
    },
  });
};
