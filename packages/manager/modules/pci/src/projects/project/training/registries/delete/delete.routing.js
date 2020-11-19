export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.training.registries.delete', {
    url: '/delete/:registryId',
    views: {
      modal: {
        component: 'ovhManagerPciProjectTrainingRegistriesDelete',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToRegistries) => goToRegistries,
      breadcrumb: () => null,
      registryId: /* @ngInject */ ($transition$) =>
        $transition$.params().registryId,
      deleteRegistry: /* @ngInject */ (
        PciProjectTrainingRegistryService,
        projectId,
      ) => (registryId) =>
        PciProjectTrainingRegistryService.delete(projectId, registryId),
      jobId: /* @ngInject */ ($transition$) => $transition$.params().registryId,
    },
  });
};
