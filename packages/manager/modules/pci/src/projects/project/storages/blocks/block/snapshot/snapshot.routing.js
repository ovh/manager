export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.blocks.snapshot', {
    url: '/snapshot?storageId',
    views: {
      modal: {
        component: 'pciProjectStorageBlocksBlockSnapshot',
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

      priceEstimation: /* @ngInject */ (
        PciProjectStorageBlockService,
        projectId,
        storage,
        catalogEndpoint,
      ) =>
        PciProjectStorageBlockService.getSnapshotPriceEstimation(
          projectId,
          storage,
          catalogEndpoint,
        ),

      goBack: /* @ngInject */ (goToBlockStorage) => goToBlockStorage,
      breadcrumb: () => null,
    },
  });
};
