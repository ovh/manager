export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.blocks.attach', {
      url: '/attach?storageId',
      views: {
        modal: {
          component: 'pciProjectStorageBlocksBlockAttach',
        },
      },
      layout: 'modal',
      resolve: {
        storageId: /* @ngInject */$transition$ => $transition$.params().storageId,
        goBack: /* @ngInject */ ($rootScope, $state, projectId) => (reload = false) => {
          if (reload) {
            $rootScope.$emit('pci_storages_blocks_refresh');
          }
          $state.go('pci.projects.project.storages.blocks', {
            projectId,
          });
        },
      },
    });
};
