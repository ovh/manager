export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.kill', {
    url: '/kill/:jobId',
    views: {
      modal: {
        component: 'pciProjectTrainingJobsKillComponent',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_jobs_kill_title'),
      goBack: /* @ngInject */ (goToJobs) => goToJobs,
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
