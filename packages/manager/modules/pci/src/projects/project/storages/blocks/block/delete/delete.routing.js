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
