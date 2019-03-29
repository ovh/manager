export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.blocks.block.attach', {
      url: '/attach',
      component: 'pciProjectStorageBlocksBlockAttach',
      layout: 'modal',
      resolve: {
        close: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.storages.blocks', {
          projectId,
        }),
      },
    });
};
