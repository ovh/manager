import {
  VOLUME_BACKUP_ROUTES,
  VOLUME_BACKUP_TRACKING,
} from '../../volume-backup.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(VOLUME_BACKUP_ROUTES.LIST.ROUTES.CREATE_VOLUME.STATE, {
    url: VOLUME_BACKUP_ROUTES.LIST.ROUTES.CREATE_VOLUME.URL,
    views: {
      volumeBackupList:
        'ovhManagerPciProjectsProjectStoragesVolumeBackupListCreateVolume',
    },
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('volumeBackup')
        .then((volumeBackup) =>
          volumeBackup ? false : { state: VOLUME_BACKUP_ROUTES.LIST.STATE },
        );
    },
    atInternet: {
      rename: `${VOLUME_BACKUP_TRACKING.PREFIX}`,
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant(
          'pci_projects_project_storages_volume_backup_list_create_volume_breadcrumb',
        ),

      volumeBackupId: /* @ngInject */ ($transition$) =>
        $transition$.params().volumeBackupId,

      volumeBackup: /* @ngInject */ (volumeBackups, volumeBackupId) =>
        volumeBackups.find(({ id }) => id === volumeBackupId),

      volume: /* @ngInject */ (
        projectId,
        volumeBackup,
        VolumeBackupService,
      ) => {
        return VolumeBackupService.getVolumeDetails(
          projectId,
          volumeBackup.volumeId,
        );
      },

      volumePrice: /* @ngInject */ (volume, getVolumePriceEstimation) =>
        getVolumePriceEstimation(volume),

      getVolumePriceEstimation: /* @ngInject */ (
        projectId,
        catalogEndpoint,
        PciProjectStorageBlockService,
      ) => (volume) =>
        PciProjectStorageBlockService.getVolumePriceEstimation(
          projectId,
          volume,
          catalogEndpoint,
        ),

      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    },
  });
};
