import {
  VOLUME_BACKUP_ROUTES,
  VOLUME_BACKUP_TRACKING,
} from '../../volume-backup.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(VOLUME_BACKUP_ROUTES.LIST.ROUTES.RESTORE_VOLUME.STATE, {
    url: VOLUME_BACKUP_ROUTES.LIST.ROUTES.RESTORE_VOLUME.URL,
    views: {
      modal: {
        component:
          'ovhManagerPciProjectsProjectStoragesVolumeBackupListRestoreVolume',
      },
    },
    layout: 'modal',
    params: {
      volumeBackup: null,
    },
    atInternet: {
      rename: VOLUME_BACKUP_TRACKING.RESTORE_VOLUME.PAGE,
    },
    redirectTo: (transition) => {
      return transition
        .injector()
        .getAsync('volumeBackup')
        .then((volumeBackup) =>
          volumeBackup ? false : { state: VOLUME_BACKUP_ROUTES.LIST.STATE },
        );
    },
    resolve: {
      breadcrumb: () => null,

      volumeBackup: /* @ngInject */ ($stateParams) => $stateParams.volumeBackup,

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

      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    },
  });
};
