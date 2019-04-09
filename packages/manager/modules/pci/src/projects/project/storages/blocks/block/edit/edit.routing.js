export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.blocks.block.edit', {
      url: '/edit',
      component: 'pciProjectStorageBlocksBlockEdit',
      resolve: {
        goBack: /* @ngInject */ ($rootScope, $state, projectId) => (reload = false) => {
          if (reload) {
            $rootScope.$emit('pci_storages_blocks_refresh');
          }
          return $state.go('pci.projects.project.storages.blocks', {
            projectId,
          });
        },
      },
    });
};
