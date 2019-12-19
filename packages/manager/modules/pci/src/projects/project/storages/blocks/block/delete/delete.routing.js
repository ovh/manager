export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.blocks.delete', {
      url: '/delete?storageId',
      views: {
        modal: {
          component: 'pciProjectStorageBlocksBlockDelete',
        },
      },
      layout: 'modal',
      resolve: {
        storageId: /* @ngInject */($transition$) => $transition$.params().storageId,
        storage: /* @ngInject */ (
          PciProjectStorageBlockService,
          projectId,
          storageId,
        ) => PciProjectStorageBlockService.get(projectId, storageId),
        goBack: /* @ngInject */ (goToBlockStorage) => goToBlockStorage,
        breadcrumb: () => null,
      },
    });
};
