export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.blocks.snapshot', {
      url: '/snapshot?storageId',
      views: {
        modal: {
          component: 'pciProjectStorageBlocksBlockSnapshot',
        },
      },
      layout: 'modal',
      resolve: {
        storageId: /* @ngInject */$transition$ => $transition$.params().storageId,
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
