export default /* @ngInject */ ($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.blocks', {
      url: '/blocks',
      component: 'pciProjectStorageBlocks',
      resolve: {
        addStorage: ($state, projectId) => () => $state.go('pci.projects.project.storages.blocks.add', {
          projectId,
        }),
        editStorage: /* @ngInject */ ($state, projectId) => storage => $state.go('pci.projects.project.storages.blocks.block.edit', {
          projectId,
          storageId: storage.id,
        }),
        attachStorage: /* @ngInject */ ($state, projectId) => storage => $state.go('pci.projects.project.storages.blocks.attach', {
          projectId,
          storageId: storage.id,
        }),
        detachStorage: /* @ngInject */ ($state, projectId) => storage => $state.go('pci.projects.project.storages.blocks.detach', {
          projectId,
          storageId: storage.id,
        }),
        createSnapshot: /* @ngInject */ ($state, projectId) => storage => $state.go('pci.projects.project.storages.blocks.snapshot', {
          projectId,
          storageId: storage.id,
        }),
        deleteStorage: /* @ngInject */($state, projectId) => ({ id: storageId }) => $state.go('pci.projects.project.storages.blocks.delete', {
          projectId,
          storageId,
        }),
      },
    });
};
