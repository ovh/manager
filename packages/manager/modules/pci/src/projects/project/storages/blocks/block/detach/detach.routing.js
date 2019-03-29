export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.blocks.block.detach', {
      url: '/detach',
      component: 'pciProjectStorageBlocksBlockDetach',
      layout: 'modal',
      resolve: {
        close: /* @ngInject */ ($state, projectId) => () => $state.go('pci.projects.project.storages.blocks', {
          projectId,
        }),
      },
    });
};
