export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.blocks.block.edit', {
      url: '/edit',
      component: 'pciProjectStorageBlocksBlockEdit',
      resolve: {
        back: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.storages.blocks', {
          projectId,
        }),
      },
    });
};
