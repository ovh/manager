export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.objects.delete', {
    url: '/delete?containerId&isHighPerfStorage',
    views: {
      modal: {
        component: 'pciProjectStorageContainersContainerDelete',
      },
    },
    layout: 'modal',
    resolve: {
      isHighPerfStorage: /* @ngInject */ ($transition$) =>
        $transition$.params().isHighPerfStorage === 'true',
      containerId: /* @ngInject */ ($transition$) =>
        $transition$.params().containerId,
      container: /* @ngInject */ (
        PciProjectStorageContainersService,
        projectId,
        containerId,
        isHighPerfStorage,
      ) =>
        PciProjectStorageContainersService.getContainer(
          projectId,
          containerId,
          isHighPerfStorage,
        ),
      goBack: /* @ngInject */ (goToStorageContainers) => goToStorageContainers,
      breadcrumb: () => null,
    },
  });
};
