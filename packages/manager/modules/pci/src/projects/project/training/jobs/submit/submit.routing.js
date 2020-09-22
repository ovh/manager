export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.jobs.submit', {
    url: '/submit',
    views: {
      'content@pci.projects.project.training':
        'pciProjectTrainingJobsSubmitComponent',
    },
    resolve: {
      goBack: /* @ngInject */ (goToJobs) => goToJobs,
      user: /* @ngInject */ (SessionService) => SessionService.getUser(),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_jobs_list_submit'),
      data: /* @ngInject */ (PciProjectTrainingDataService, projectId) =>
        PciProjectTrainingDataService.getAll(projectId),
      presetImages: /* @ngInject */ (PciProjectTrainingService, projectId) =>
        PciProjectTrainingService.getPresetImages(projectId),
      gpus: /* @ngInject */ (PciProjectTrainingService, projectId) => (
        region,
      ) => PciProjectTrainingService.getGpus(projectId, region),
      goToData: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.data.add', {
          projectId,
        }),
    },
  });
};
