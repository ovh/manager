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
      containers: /* @ngInject */ (
        PciProjectStorageContainersService,
        projectId,
      ) => PciProjectStorageContainersService.getAll(projectId),
      presetImages: /* @ngInject */ (PciProjectTrainingService, projectId) =>
        PciProjectTrainingService.getPresetImages(projectId),
      goToData: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.storages.object-storage.add', {
          projectId,
        }),
    },
  });
};
