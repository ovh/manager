export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.registries.add', {
    url: '/add',
    views: {
      modal: {
        component: 'ovhManagerPciProjectTrainingRegistriesAddRegistryComponent',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToRegistries) => goToRegistries,
      breadcrumb: () => null,
      saveRegistry: /* @ngInject */ (
        PciProjectTrainingRegistryService,
        projectId,
      ) => (registry) =>
        PciProjectTrainingRegistryService.create(projectId, registry),
    },
  });
};
