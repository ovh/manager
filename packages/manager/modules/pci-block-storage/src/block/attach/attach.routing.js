export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.blocks.attach', {
    url: '/attach?storageId',
    views: {
      modal: {
        component: 'pciProjectStorageBlocksBlockAttach',
      },
    },
    layout: 'modal',
    resolve: {
      storageId: /* @ngInject */ ($transition$) =>
        $transition$.params().storageId,
      storage: /* @ngInject */ (
        PciProjectStorageBlockService,
        projectId,
        storageId,
      ) => PciProjectStorageBlockService.get(projectId, storageId),
      instances: /* @ngInject */ (
        PciProjectStorageBlockService,
        projectId,
        storage,
      ) =>
        PciProjectStorageBlockService.getCompatiblesInstances(
          projectId,
          storage,
        ),
      goBack: /* @ngInject */ (goToBlockStorage) => goToBlockStorage,
      breadcrumb: () => null,
    },
  });
};
