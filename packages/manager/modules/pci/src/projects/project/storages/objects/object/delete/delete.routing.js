export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.objects.list.delete', {
    url: '/delete?containerId',
    views: {
      modal: {
        component: 'pciProjectStorageContainersContainerDelete',
      },
    },
    layout: 'modal',
    resolve: {
      containerId: /* @ngInject */ ($transition$) =>
        $transition$.params().containerId,
      container: /* @ngInject */ (
        PciProjectStorageContainersService,
        projectId,
        containerId,
      ) =>
        PciProjectStorageContainersService.getContainer(projectId, containerId),
      goBack: /* @ngInject */ (goToStorageContainers) => goToStorageContainers,
      breadcrumb: () => null,
    },
  });
};
