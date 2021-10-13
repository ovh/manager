import { VOLUME_ADDON_FAMILY } from '../block.constants';

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

      volumesAvailability: /* @ngInject */ (
        projectId,
        coreConfig,
        PciProjectStorageBlockService,
      ) =>
        PciProjectStorageBlockService.getVolumesAvailability(projectId, {
          ovhSubsidiary: coreConfig.getUser().ovhSubsidiary,
          addonFamily: VOLUME_ADDON_FAMILY,
        }),

      catalog: /* @ngInject */ (coreConfig, PciProjectStorageBlockService) =>
        PciProjectStorageBlockService.getCatalog(
          coreConfig.getUser().ovhSubsidiary,
        ),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_projects_project_storages_blocks_add_title'),
    },
  });
};
