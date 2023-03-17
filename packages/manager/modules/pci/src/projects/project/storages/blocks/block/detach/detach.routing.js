import { VOLUME_BLOCK_TRACKING } from '../../block.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.blocks.detach', {
    url: '/detach?storageId',
    views: {
      modal: {
        component: 'pciProjectStorageBlocksBlockDetach',
      },
    },
    layout: 'modal',
    atInternet: {
      rename: VOLUME_BLOCK_TRACKING.DETACH_VOLUME.PAGE,
    },
    resolve: {
      storageId: /* @ngInject */ ($transition$) =>
        $transition$.params().storageId,
      storage: /* @ngInject */ (
        PciProjectStorageBlockService,
        projectId,
        storageId,
      ) => PciProjectStorageBlockService.get(projectId, storageId),
      goBack: /* @ngInject */ (goToBlockStorage) => goToBlockStorage,
      breadcrumb: () => null,
    },
  });
};
