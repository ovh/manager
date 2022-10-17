export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.cold-archives.delete', {
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
        PciStoragesColdArchiveService,
        projectId,
        containerId,
      ) =>
        PciStoragesColdArchiveService.getAllColdArchives(
          projectId,
          containerId,
        ),
      goBack: /* @ngInject */ (goToStorageContainers) => goToStorageContainers,
      breadcrumb: () => null,
    },
  });
};
