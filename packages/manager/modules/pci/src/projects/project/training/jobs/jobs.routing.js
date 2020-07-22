export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs', {
    url: '/jobs',
    views: {
      trainingView: 'pciProjectTrainingJobsComponent',
    },
    redirectTo: {
      state: 'pci.projects.project.training.jobs.list',
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_jobs_title'),
      jobList: /* @ngInject */ (PciProjectTrainingJobsService, projectId) =>
        PciProjectTrainingJobsService.getAll(projectId),
      job: /* @ngInject */ (PciProjectTrainingJobsService, projectId) => (
        jobId,
      ) => PciProjectTrainingJobsService.get(projectId, jobId),
      jobInfo: /* @ngInject */ ($state, projectId) => (jobId) =>
        $state.go('pci.projects.project.training.jobs.info', {
          projectId,
          jobId,
        }),
      submitJobLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.training.jobs.submit', {
          projectId,
        }),
      submitJob: /* @ngInject */ (
        PciProjectTrainingJobsService,
        $state,
        projectId,
      ) => (jobSpec) =>
        PciProjectTrainingJobsService.submit(projectId, jobSpec).then(() => {
          $state.go(
            'pci.projects.project.training.jobs.list',
            {
              projectId,
            },
            {
              reload: true,
            },
          );
        }),
    },
  });
};
