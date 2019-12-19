export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.blocks.block.edit', {
      url: '/edit',
      component: 'pciProjectStorageBlocksBlockEdit',
      resolve: {
        goBack: /* @ngInject */ (goToBlockStorage) => goToBlockStorage,
        breadcrumb: /* @ngInject */ ($translate) => $translate.instant('pci_projects_project_storages_blocks_block_edit_title'),
      },
    });
};
