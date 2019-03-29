export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.blocks.block.delete', {
      url: '/delete',
      views: {
        modal: {
          component: 'pciProjectStorageBlocksBlockDelete',
        },
      },
      layout: 'modal',
      resolve: {
        close: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.storages.blocks', {
          projectId,
        }),
      },
    });
};
