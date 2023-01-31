import {
  VOLUME_BACKUP_ROUTES,
  VOLUME_BACKUP_TRACKING,
} from '../volume-backup.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(VOLUME_BACKUP_ROUTES.LIST.STATE, {
    url: VOLUME_BACKUP_ROUTES.LIST.URL,
    component: 'ovhManagerPciProjectsProjectStoragesVolumeBackupList',
    atInternet: {
      rename: `${VOLUME_BACKUP_TRACKING.PREFIX}`,
    },
    resolve: {
      breadcrumb: () => null,

      volumeBackupLink: /* @ngInject */ ($state, projectId) => (volumeBackup) =>
        $state.href(VOLUME_BACKUP_ROUTES.DASHBOARD, {
          projectId,
          volumeBackupId: volumeBackup.id,
        }),

      goToAddVolumeBackup: /* @ngInject */ ($state, projectId) => () => {
        return $state.go(VOLUME_BACKUP_ROUTES.ADD.STATE, {
          projectId,
        });
      },

      goToRestoreVolume: /* @ngInject */ ($state, projectId) => () => {
        return $state.go(VOLUME_BACKUP_ROUTES.ADD.STATE, {
          projectId,
        });
      },

      goToDeleteVolume: /* @ngInject */ ($state, projectId) => () => {
        return $state.go(VOLUME_BACKUP_ROUTES.DELETE.STATE, {
          projectId,
        });
      },
    },
  });
};
