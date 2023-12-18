export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.blocks.block', {
    url: '/:storageId',
    abstract: true,
    resolve: {
      storageId: /* @ngInject */ ($transition$) =>
        $transition$.params().storageId,
      storage: /* @ngInject */ (
        PciProjectStorageBlockService,
        projectId,
        storageId,
      ) => PciProjectStorageBlockService.get(projectId, storageId),
      breadcrumb: /* @ngInject */ (storage) => storage.name,
    },
  });
};
