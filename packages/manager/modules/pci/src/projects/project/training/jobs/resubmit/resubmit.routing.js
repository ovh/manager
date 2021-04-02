export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.resubmit', {
    url: '/resubmit/:jobId',
    views: {
      modal: {
        component: 'pciProjectTrainingJobsResubmitComponent',
      },
    },
    layout: 'modal',
    params: {
      previousState: null,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_jobs_resubmit'),
      jobId: /* @ngInject */ ($transition$) => $transition$.params().jobId,
      previousState: /* @ngInject */ ($transition$) => {
        return $transition$.params().previousState;
      },
      job: /* @ngInject */ (PciProjectTrainingJobService, projectId, jobId) => {
        return PciProjectTrainingJobService.get(projectId, jobId);
      },
      resubmitJob: /* @ngInject */ (
        PciProjectTrainingJobService,
        projectId,
        job,
      ) => () => PciProjectTrainingJobService.resubmit(projectId, job.spec),
      goToJobInfo: /* @ngInject */ ($state, projectId, jobId) => () =>
        $state.go('pci.projects.project.training.jobs.info', {
          projectId,
          jobId,
        }),
    },
  });
};
