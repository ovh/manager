export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.registries', {
    url: '/registries',
    component: 'pciProjectTrainingRegistriesComponent',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_training_registries_title'),
      registryList: /* @ngInject */ (
        PciProjectTrainingRegistryService,
        projectId,
      ) => PciProjectTrainingRegistryService.getAll(projectId),
      goToRegistryAdd: /* @ngInject */ ($state, projectId) => () =>
        $state.go('pci.projects.project.training.registries.add', {
          projectId,
        }),
      goToRegistryDelete: /* @ngInject */ ($state, projectId) => (registryId) =>
        $state.go('pci.projects.project.training.registries.delete', {
          projectId,
          registryId,
        }),
      goToRegistries: ($state, CucCloudMessage, projectId) => (
        message = false,
        type = 'success',
      ) => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'pci.projects.project.training.registries',
          {
            projectId,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() =>
            CucCloudMessage[type](
              message,
              'pci.projects.project.training.registries',
            ),
          );
        }

        return promise;
      },
    },
  });
};
