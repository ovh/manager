export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.objects.addUser', {
    url: '/addUser?containerId',
    views: {
      modal: {
        component: 'pciProjectStorageContainersContainerAddUser',
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
