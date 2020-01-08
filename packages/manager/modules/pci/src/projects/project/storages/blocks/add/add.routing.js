export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.blocks.add', {
    url: '/new',
    component: 'pciProjectStorageBlocksAdd',
    resolve: {
      goBack: /* @ngInject */ (goToBlockStorage) => goToBlockStorage,
      cancelLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.storages.blocks', {
          projectId,
        }),
      quotaUrl: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.quota', {
          projectId,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_storages_blocks_add_title'),
    },
  });
};
